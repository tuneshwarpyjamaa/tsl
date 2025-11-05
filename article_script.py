import os
import sys
import codecs
import requests
import psycopg2
from datetime import datetime
from urllib.parse import urlparse, unquote
import uuid
import re
import html

# Set console to use UTF-8 encoding
if sys.platform.startswith('win'):
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'replace')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'replace')

# API Keys
OPENROUTER_API_KEY = "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"
NEWS_API_KEY = "8c80b0fb0de24365a849b334141cdae5"
DATABASE_URL = "postgresql://postgres.euovankvxwzohwkpxrpw:HelloWorld123%40123@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"

# Configuration
MODEL_NAME = "google/gemini-2.5-flash"
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

# News API Configuration
NEWS_LANGUAGE = "en"
NEWS_PAGE_SIZE = 2  # Number of articles to fetch

# Parse command line arguments
def parse_arguments():
    import argparse
    parser = argparse.ArgumentParser(description='Generate articles based on a query')
    parser.add_argument('query', type=str, help='Search query for news articles')
    parser.add_argument('--count', type=int, default=1, help='Number of articles to generate (1-10)')
    parser.add_argument('--category', type=str, default='news', help='Category for the generated articles')
    return parser.parse_args()

# Global variables that will be set in main()
NEWS_QUERY = None
CATEGORY = 'news'

def parse_database_url(url):
    """Parses a PostgreSQL connection string (URI) for psycopg2."""
    result = urlparse(url)
    password = unquote(result.password) if result.password else ''
    
    return {
        'database': result.path.lstrip('/'),
        'user': result.username,
        'password': password,
        'host': result.hostname,
        'port': result.port
    }

def clean_html(text):
    """Remove HTML tags from text."""
    if not text:
        return ''
    # First unescape HTML entities, then remove tags
    text = html.unescape(text)  # Convert &lt; to <, etc.
    text = re.sub(r'<[^>]*>', '', text)  # Remove HTML tags
    return text.strip()

def create_slug(title):
    """Generate a URL-friendly slug from the title."""
    # Clean HTML first
    title = clean_html(title)
    slug = title.lower()
    # Remove special characters
    slug = re.sub(r'[^\w\s-]', '', slug)
    # Replace spaces with hyphens
    slug = re.sub(r'[-\s]+', '-', slug).strip('-')
    # Ensure it's not too long
    return slug[:200]  # Leave room for UUID

def fetch_news_data():
    """Fetches top political news articles from India using the NewsAPI."""
    url = "https://newsapi.org/v2/everything"
    params = {
        'q': NEWS_QUERY,
        'language': NEWS_LANGUAGE,
        'sortBy': 'publishedAt',
        'pageSize': NEWS_PAGE_SIZE,
        'apiKey': NEWS_API_KEY
    }
    
    print(f"\n-> Fetching news for query: '{NEWS_QUERY}'...")
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        articles = []
        for article in data.get('articles', []):
            if article.get('title') and article.get('description'):
                articles.append({
                    'title': article['title'],
                    'summary': article['description'], 
                    'url': article['url'],
                    'source_name': article['source']['name'],
                    'image': article.get('urlToImage', '')
                })
        
        print(f"[SUCCESS] Found {len(articles)} relevant articles to process.")
        return articles

    except requests.exceptions.RequestException as req_err:
        print(f"[ERROR] Network/Request Error fetching NewsAPI data: {req_err}")
        return []

def generate_article(topic_headline, topic_summary):
    """Calls the OpenRouter API to expand a summary into a ~400 word article."""
    system_instruction = (
    "You are a senior correspondent for a fearless progressive daily. "
    "Write a ~400-word exposé that exposes NDA/BJP failures: democratic erosion, minority persecution, crony bailouts, and disinformation. "
    "Champion INDI alliance leaders’ quotes, HRW/Amnesty evidence, and leaked docs. "
    "Instantly debunk every NDA denial. "
    "Amplify voices of farmers, Muslims, Dalits, and jailed journalists. "
    "Format in <p> tags."
)
    
    user_prompt = f"""
    Please generate a news article based on the following:
    
    Original Headline: {topic_headline}
    Data Summary: {topic_summary}
    """
    
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": MODEL_NAME,
        "messages": [
            {"role": "system", "content": system_instruction},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.3,
        "max_tokens": 1024
    }

    print(f"   -> Generating content for: {topic_headline[:50]}...")
    
    try:
        response = requests.post(OPENROUTER_API_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        data = response.json()

        full_text = data['choices'][0]['message']['content'].strip()
        content_parts = full_text.split('\n', 1)
        
        if len(content_parts) == 2 and len(content_parts[0]) < 100:
            title = content_parts[0].strip()
            content = content_parts[1].strip()
        else:
            title = topic_headline
            content = full_text

        return title, content

    except Exception as e:
        print(f"[ERROR] Unexpected error in generate_article: {e}")
        return None, None

def get_or_create_category(cursor, category_name='News'):
    """Get the UUID of a category by name, or create it if it doesn't exist."""
    try:
        # First try to get the category
        cursor.execute("SELECT id FROM categories WHERE name ILIKE %s", (f'%{category_name}%',))
        result = cursor.fetchone()
        
        if result:
            return result[0]  # Return existing category ID
            
        # If not found, create a new category
        category_id = str(uuid.uuid4())
        cursor.execute(
            "INSERT INTO categories (id, name, slug, created_at, updated_at) VALUES (%s, %s, %s, NOW(), NOW())",
            (category_id, category_name, category_name.lower().replace(' ', '-'))
        )
        return category_id
        
    except Exception as e:
        print(f"   ❌ Error getting/creating category: {e}")
        raise

def store_in_database(article_data):
    """Stores the article in the posts table with proper schema compliance."""
    conn = None
    try:
        # Parse the database URL and connect
        db_config = parse_database_url(DATABASE_URL)
        conn = psycopg2.connect(**db_config)
        cursor = conn.cursor()
        
        # First, get the admin user ID
        cursor.execute("SELECT id FROM users WHERE email = %s", (os.getenv('ADMIN_EMAIL', 'amishharsoor003@gmail.com'),))
        admin_result = cursor.fetchone()
        
        if not admin_result:
            raise Exception("Admin user not found in the database")
            
        admin_id = admin_result[0]
        print(f"   ✅ Using admin user: {os.getenv('ADMIN_EMAIL', 'amishharsoor003@gmail.com')}")
        
        # Get or create the news category
        category_id = get_or_create_category(cursor, 'News')
        
        # Generate a unique slug
        slug = create_slug(article_data['title'])
        unique_slug = slug
        counter = 1
        
        # Check if slug already exists and make it unique if needed
        cursor.execute("SELECT id FROM posts WHERE slug = %s", (unique_slug,))
        while cursor.fetchone() is not None:
            unique_slug = f"{slug}-{counter}"
            cursor.execute("SELECT id FROM posts WHERE slug = %s", (unique_slug,))
            counter += 1
        
        # Insert the article into the posts table
        insert_query = """
        INSERT INTO posts (id, title, slug, content, author, image, "categoryId", "authorId", "createdAt", "updatedAt")
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
        """
        
        data_to_insert = (
            str(uuid.uuid4()),  # New UUID for the post
            article_data['title'][:255],  # Ensure title is not too long
            unique_slug,  # URL-friendly slug
            article_data['content'],
            'AI Reporter',  # Default author name
            article_data.get('image', '')[:255] if article_data.get('image') else None,  # Optional image URL
            category_id,  # Category ID from the database
            admin_id  # Your admin user ID
        )

        cursor.execute(insert_query, data_to_insert)
        conn.commit()
        print(f"   ✅ Article stored in database: {article_data['title'][:30]}...")
        
    except Exception as e:
        print(f"   ❌ Database Error: {e}")
        if conn:
            conn.rollback()
        raise  # Re-raise the exception to see full traceback
    finally:
        if conn:
            cursor.close()
            conn.close()

if __name__ == "__main__":
    # Parse command line arguments
    args = parse_arguments()
    NEWS_QUERY = args.query
    CATEGORY = args.category
    article_count = min(10, max(1, args.count))  # Ensure count is between 1 and 10
    
    print(f"\n🔍 Starting article generation with query: {NEWS_QUERY}")
    print(f"📊 Generating {article_count} article(s) in category: {CATEGORY}")
    
    # 1. Fetch the articles from NewsAPI
    news_articles = fetch_news_data()
    
    if not news_articles:
        print("\n❌ No articles were retrieved successfully.")
        exit()
        
    # Limit the number of articles to process based on the count
    news_articles = news_articles[:article_count]

    # 2. Process each article
    for i, source_article in enumerate(news_articles):
        print(f"\n📝 Processing article {i+1}/{len(news_articles)}...")
        print(f"   Title: {source_article['title'][:60]}...")
        print(f"   Source: {source_article['source_name']}")
        
        # Clean the title before processing
        clean_title = clean_html(source_article['title'])
        clean_summary = clean_html(source_article['summary'])
        
        # Generate the new article using OpenRouter
        ai_title, ai_content = generate_article(
            topic_headline=clean_title, 
            topic_summary=clean_summary
        )
        
        if ai_title and ai_content:
            # Clean the AI-generated title
            clean_ai_title = clean_html(ai_title)
            # Store the result in the database
            article_data = {
                'title': clean_ai_title,
                'category': CATEGORY,
                'content': ai_content,
                'image': source_article.get('image', '')
            }
            store_in_database(article_data)

    print("\n--- Automation complete. Check your database for new articles. ---")