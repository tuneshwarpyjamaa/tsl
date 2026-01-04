import dotenv from 'dotenv';
import fs from 'fs';
import { db } from './src/lib/db.js';
import { connectDB, closeDB } from './src/config/db.js';
import { Category } from './src/models/Category.js';
import { Post } from './src/models/Post.js';
import slugify from 'slugify';

// Load environment variables
dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
    console.error('❌ Error: OPENROUTER_API_KEY is not set in .env file');
    console.log('💡 Get your API key from: https://openrouter.ai/keys');
    process.exit(1);
}

/**
 * Generate SEO-optimized article using OpenAI API
 */
async function generateArticleWithOpenAI(title) {
    const prompt = `You are an expert SEO content writer. Write a comprehensive, SEO-optimized news article with the following title: "${title}"

Requirements:
1. Write 800-1200 words
2. Use proper HTML formatting with <h2>, <h3>, <p>, <ul>, <li> tags
3. Include relevant keywords naturally throughout the content
4. Write in an engaging, journalistic style
5. Include an introduction, body with subheadings, and conclusion
6. Make it informative and well-researched
7. Use proper grammar and punctuation
8. Focus on providing value to readers

Format your response as valid HTML content suitable for a blog post. Do not include <html>, <head>, or <body> tags - just the article content.`;

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': 'https://tmw-blog.com',
                'X-Title': 'TMW Blog Article Generator'
            },
            body: JSON.stringify({
                model: 'nex-agi/deepseek-v3.1-nex-n1:free', // Free DeepSeek model via OpenRouter
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert SEO content writer specializing in news articles. You write engaging, well-structured, and SEO-optimized content.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 2500
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`OpenRouter API error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content.trim();

        return { content };
    } catch (error) {
        console.error(`Error generating article for "${title}":`, error.message);
        throw error;
    }
}

/**
 * Generate unique slug from title
 */
async function generateUniqueSlug(title) {
    let slug = slugify(title, { lower: true, strict: true });
    let counter = 1;
    let isUnique = false;

    while (!isUnique) {
        try {
            const existing = await Post.findBySlug(slug);
            if (!existing) {
                isUnique = true;
            } else {
                slug = `${slugify(title, { lower: true, strict: true })}-${counter}`;
                counter++;
            }
        } catch (error) {
            isUnique = true;
        }
    }

    return slug;
}

/**
 * Save article to database
 */
async function saveArticleToDatabase(title, content, categoryId) {
    try {
        const slug = await generateUniqueSlug(title);

        const article = await Post.create({
            title,
            slug,
            content,
            categoryId,
            author: 'AI Writer',
            image: null
        });

        return article;
    } catch (error) {
        console.error(`Error saving article "${title}" to database:`, error.message);
        throw error;
    }
}

/**
 * Read titles from a text file (one title per line)
 */
function readTitlesFromFile(filename) {
    try {
        if (!fs.existsSync(filename)) {
            console.error(`❌ Error: File "${filename}" not found`);
            console.log(`💡 Create a file called "${filename}" with one article title per line`);
            process.exit(1);
        }

        const content = fs.readFileSync(filename, 'utf-8');
        const titles = content
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0 && !line.startsWith('#')); // Filter empty lines and comments

        if (titles.length === 0) {
            console.error(`❌ Error: No titles found in "${filename}"`);
            process.exit(1);
        }

        return titles;
    } catch (error) {
        console.error(`❌ Error reading file "${filename}":`, error.message);
        process.exit(1);
    }
}

/**
 * Main function to generate and store articles
 */
async function generateAndStoreArticles(titles) {
    console.log('🚀 Starting article generation process...\n');

    // Get the News category
    let newsCategory;
    try {
        newsCategory = await Category.findBySlug('news');
        if (!newsCategory) {
            console.error('❌ Error: "news" category not found in database');
            console.log('💡 Please create the "news" category first or update the script to use a different category');
            process.exit(1);
        }
        console.log(`✅ Found News category (ID: ${newsCategory.id})\n`);
    } catch (error) {
        console.error('❌ Error fetching category:', error.message);
        process.exit(1);
    }

    const results = {
        successful: [],
        failed: []
    };

    for (let i = 0; i < titles.length; i++) {
        const title = titles[i].trim();
        console.log(`\n📝 Processing article ${i + 1}/${titles.length}: "${title}"`);

        try {
            // Generate article content
            console.log('   ⏳ Generating content with OpenAI...');
            const { content } = await generateArticleWithOpenAI(title);
            console.log(`   ✅ Content generated (${content.length} characters)`);

            // Save to database
            console.log('   ⏳ Saving to database...');
            const savedArticle = await saveArticleToDatabase(title, content, newsCategory.id);
            console.log(`   ✅ Saved successfully!`);
            console.log(`      - ID: ${savedArticle.id}`);
            console.log(`      - Slug: ${savedArticle.slug}`);

            results.successful.push({
                title,
                id: savedArticle.id,
                slug: savedArticle.slug
            });

            // Delay to avoid rate limiting
            if (i < titles.length - 1) {
                console.log('   ⏸️  Waiting 2 seconds before next article...');
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

        } catch (error) {
            console.error(`   ❌ Failed: ${error.message}`);
            results.failed.push({
                title,
                error: error.message
            });
        }
    }

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 GENERATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successful: ${results.successful.length}`);
    console.log(`❌ Failed: ${results.failed.length}`);
    console.log(`📈 Total: ${titles.length}`);

    if (results.successful.length > 0) {
        console.log('\n✅ Successfully generated articles:');
        results.successful.forEach((article, index) => {
            console.log(`   ${index + 1}. ${article.title}`);
            console.log(`      Slug: ${article.slug}`);
        });
    }

    if (results.failed.length > 0) {
        console.log('\n❌ Failed articles:');
        results.failed.forEach((article, index) => {
            console.log(`   ${index + 1}. ${article.title}`);
            console.log(`      Error: ${article.error}`);
        });
    }

    console.log('\n✨ Process completed!\n');
}

// Get filename from command line argument or use default
const filename = process.argv[2] || 'article_titles.txt';

console.log(`📄 Reading titles from: ${filename}\n`);

// Read titles from file and run
const articleTitles = readTitlesFromFile(filename);
console.log(`📋 Found ${articleTitles.length} titles to process\n`);

// Main execution with proper database initialization
(async () => {
    try {
        // Initialize database connection
        console.log('🔌 Connecting to database...\n');
        await connectDB();

        // Run article generation
        await generateAndStoreArticles(articleTitles);

        console.log('🎉 All done! Exiting...');

        // Close database connection
        await closeDB();
        process.exit(0);
    } catch (error) {
        console.error('💥 Fatal error:', error);

        // Ensure database is closed on error
        await closeDB();
        process.exit(1);
    }
})();
