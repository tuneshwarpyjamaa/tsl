# 1. INSTALL DEPENDENCIES
# Before running this script block, ensure you run this command in a separate Colab cell:
# !pip install requests psycopg2-binary
# -----------------------------------------------------------------------------------

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
import json
from requests.exceptions import JSONDecodeError, RequestException, Timeout

# --- 2. GLOBAL VARIABLES (Fetched from environment variables) ---
OPENROUTER_API_KEY = os.environ.get('OPENROUTER_API_KEY')
DATABASE_URL = os.environ.get('DATABASE_URL')
ADMIN_EMAIL_PLACEHOLDER = os.environ.get('ADMIN_EMAIL', 'admin@example.com')
CATEGORY = "news" # Set category to "news" as requested by the user
# ARTICLE_COUNT is derived from the STATIC_TOPICS list length

# Configuration (Constants)
# Using the user-requested model and explicitly specifying the API endpoint
# UPDATED FIX: Changed model name to the user-requested x-ai/grok-4-fast.
MODEL_NAME = "x-ai/grok-4-fast"
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
NEWS_LANGUAGE = "en"
NEWS_PAGE_SIZE = 100

# --- DYNAMIC TOPIC GENERATION ---
# Function to generate 25 unique political news titles for India
def generate_topics():
    """Generate 25 unique political news titles for India using AI."""
    if not OPENROUTER_API_KEY:
        print("[ERROR] OpenRouter API key is missing. Cannot generate topics.")
        return []

    system_instruction = (
        "You are a news editor specializing in Indian politics. Generate 25 unique, realistic, and latest(from previous day up until this exact second) political news headlines for India. "
        "Focus on current events, elections, government policies, international relations, and political developments. "
        "Ensure all titles are distinct and not repeated. Provide them as a numbered list from 1 to 25."
    )

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": MODEL_NAME,
        "messages": [
            {"role": "system", "content": system_instruction},
            {"role": "user", "content": "Generate 25 unique political news headlines for India."}
        ],
        "temperature": 0.7,
        "max_tokens": 1024
    }

    print("Generating 25 unique political news topics...")

    try:
        response = requests.post(OPENROUTER_API_URL, headers=headers, json=payload, timeout=30)

        if response.status_code != 200:
            print(f"[API ERROR] Failed to generate topics: HTTP {response.status_code}")
            return []

        data = response.json()
        full_text = data['choices'][0]['message']['content'].strip()

        # Parse the numbered list
        topics = []
        for line in full_text.split('\n'):
            line = line.strip()
            if line and line[0].isdigit() and '. ' in line:
                title = line.split('. ', 1)[1].strip()
                if title:
                    topics.append(title)

        if len(topics) < 25:
            print(f"[WARNING] Only generated {len(topics)} topics instead of 25.")
        else:
            print(f"Successfully generated {len(topics)} topics.")

        return topics[:25]  # Limit to 25

    except Exception as e:
        print(f"[ERROR] Failed to generate topics: {e}")
        return []

# Helper function definitions
def check_environment():
    """Check if required environment variables are set."""
    if not OPENROUTER_API_KEY:
        raise ValueError("OPENROUTER_API_KEY environment variable is required")
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL environment variable is required")
    print("Environment variables loaded successfully.")


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
    text = html.unescape(text)
    text = re.sub(r'<[^>]*>', '', text)
    return text.strip()

def create_slug(title):
    """Generate a URL-friendly slug from the title."""
    title = clean_html(title)
    slug = title.lower()
    slug = re.sub(r'[^​-\w\s-]', '', slug)
    slug = re.sub(r'[-\s]+', '-', slug).strip('-')
    return slug[:200]


def generate_article(topic_headline, topic_summary):
    """
    Calls the OpenRouter API to expand a summary into a ~400 word article.
    Includes robust error handling for API failures.
    """
    if not OPENROUTER_API_KEY:
        print("\n[ERROR] OpenRouter API key is missing. Skipping generation.")
        return None, None

    system_instruction = (
    "You are a seasoned journalist writing for a leading nationalist news platform committed to India's resurgence. "
    "Craft a compelling 400-word news article that highlights India's strength, unity, and progress under decisive leadership. "
    "Subtly underscore the achievements of the right-wing government while exposing the divisive, anti-development agenda of the Congress-led opposition and the liberal ecosystem. "
    "Use strong, patriotic language to inspire pride in Bharat's rise. "
    "Quote official sources, security experts, and pro-India voices; contrast them with the hypocrisy and defeatism of the left-liberal cabal. "
    "Frame opposition criticism as rooted in vote-bank politics and foreign-funded narratives aimed at weakening national resolve. "
    "Maintain factual accuracy but weave in a narrative of resilience against forces trying to pull India down. "
    "Format the article in clean <p> HTML tags for web display."
    "Don't write the word count at the end of the article."
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

    print(f"    -> Generating content for: {topic_headline[:50]}...")

    try:
        response = requests.post(OPENROUTER_API_URL, headers=headers, json=payload, timeout=30)

        # --- CRITICAL FIX: Robust Error Handling for API Key/Network Issues ---
        if response.status_code != 200:
            print(f"\n[API ERROR] Received HTTP Status Code {response.status_code}")
            try:
                # Attempt to read the JSON error message if the API provides one
                error_data = response.json()
                print(f"[API ERROR DETAILS] {error_data.get('message', 'No specific error message.')}")
            except JSONDecodeError:
                # This catches the 'Expecting value' error, usually a 401 or 429 non-JSON response
                print(f"[API ERROR DETAILS] API response was not JSON. Status {response.status_code}. This usually means an invalid API key, rate limit exceeded, or network issue. Raw response text: {response.text[:200]}...")
            return None, None

        # If status code is 200, proceed to decode JSON
        data = response.json()

        full_text = data['choices'][0]['message']['content'].strip()

        # Logic to separate title from content if the AI provided one
        content_parts = full_text.split('\n', 1)

        # Check if the AI generated a short title followed by content
        # Also ensure the extracted title isn't just the original headline
        if len(content_parts) == 2 and len(content_parts[0]) < 100 and clean_html(content_parts[0].strip()).lower() != clean_html(topic_headline).lower():
            title = content_parts[0].strip()
            content = content_parts[1].strip()
        else:
            title = topic_headline
            content = full_text

        return title, content

    except Timeout:
        print("[ERROR] Request timed out (30 seconds).")
        return None, None
    except RequestException as e:
        print(f"[ERROR] A network or request error occurred: {e}")
        return None, None
    except Exception as e:
        print(f"[ERROR] An unexpected error occurred during article generation: {e}")
        return None, None

def get_or_create_category(cursor, category_name='News'):
    """Get the UUID of a category by name, or create it if it doesn't exist."""
    try:
        cursor.execute("SELECT id FROM categories WHERE name ILIKE %s", (f'%{category_name}%',))
        result = cursor.fetchone()

        if result:
            return result[0]

        category_id = str(uuid.uuid4())
        cursor.execute(
            "INSERT INTO categories (id, name, slug, created_at, updated_at) VALUES (%s, %s, %s, NOW(), NOW())",
            (category_id, category_name, category_name.lower().replace(' ', '-'))
        )
        return category_id

    except Exception as e:
        print(f"    ❌ Error getting/creating category: {e}")
        raise

def store_in_database(article_data):
    """Stores the article in the posts table with proper schema compliance."""
    if not DATABASE_URL or not ADMIN_EMAIL_PLACEHOLDER:
        print("\n[ERROR] Database or Admin Email information is missing. Skipping database storage.")
        return

    conn = None
    try:
        db_config = parse_database_url(DATABASE_URL)
        conn = psycopg2.connect(**db_config)
        cursor = conn.cursor()

        # First, get the admin user ID
        cursor.execute("SELECT id FROM users WHERE email = %s", (ADMIN_EMAIL_PLACEHOLDER,))
        admin_result = cursor.fetchone()

        if not admin_result:
            raise Exception(f"Admin user ({ADMIN_EMAIL_PLACEHOLDER}) not found in the database")

        admin_id = admin_result[0]
        print(f"    ✅ Using admin user: {ADMIN_EMAIL_PLACEHOLDER}")

        category_id = get_or_create_category(cursor, CATEGORY) # Use the user-defined CATEGORY

        slug = create_slug(article_data['title'])
        unique_slug = slug
        counter = 1

        # Ensure slug uniqueness
        cursor.execute("SELECT id FROM posts WHERE slug = %s", (unique_slug,))
        while cursor.fetchone() is not None:
            unique_slug = f"{slug}-{counter}"
            cursor.execute("SELECT id FROM posts WHERE slug = %s", (unique_slug,))
            counter += 1

        insert_query = """
        INSERT INTO posts (id, title, slug, content, author, image, "categoryId", "authorId", "createdAt", "updatedAt")
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
        """

        data_to_insert = (
            str(uuid.uuid4()),
            article_data['title'][:255],
            unique_slug,
            article_data['content'],
            'AI Reporter',
            article_data.get('image', '')[:255] if article_data.get('image') else None,
            category_id,
            admin_id
        )

        cursor.execute(insert_query, data_to_insert)
        conn.commit()
        print(f"    ✅ Article stored in database: {article_data['title'][:30]}...")

    except Exception as e:
        print(f"    ❌ Database Error: {e}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            cursor.close()
            conn.close()

if __name__ == "__main__":

    check_environment()

    TOPICS = generate_topics()
    article_count = len(TOPICS)

    if article_count == 0:
        print("No topics generated. Exiting.")
        exit(1)

    print(f"\n🔍 Starting article generation for {article_count} generated topics.")
    print(f"📊 Generating article(s) in category: {CATEGORY}")

    # 1. Process each generated topic
    for i, topic_string in enumerate(TOPICS):

        # In this flow, the single topic string acts as both the headline and the summary for the AI
        source_article = {
            'title': topic_string,
            'summary': topic_string,
            'image': '' # No source image available for manual topics
        }

        print(f"\n📝 Processing topic {i+1}/{article_count}...")
        print(f"    Topic: {source_article['title'][:60]}...")

        clean_title = clean_html(source_article['title'])
        clean_summary = clean_html(source_article['summary'])

        # Generate the new article using OpenRouter
        ai_title, ai_content = generate_article(
            topic_headline=clean_title,
            topic_summary=clean_summary
        )

        if ai_title and ai_content:
            clean_ai_title = clean_html(ai_title)
            article_data = {
                'title': clean_ai_title,
                'category': CATEGORY,
                'content': ai_content,
                'image': source_article.get('image', '')
            }
            store_in_database(article_data)
        else:
            print(f"    ⚠️ Skipping database storage for topic {i+1} due to generation failure.")

    print("\n--- Automation complete. Check your database for new articles. ---")