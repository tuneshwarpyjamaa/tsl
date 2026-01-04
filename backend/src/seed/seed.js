import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import { db } from '../lib/db.js';
import { Category } from '../models/Category.js';
import { Post } from '../models/Post.js';

dotenv.config();

// Connect to database
await connectDB(process.env.DATABASE_URL);

async function run() {
  try {

    const categoriesData = [
      { name: 'News', slug: 'news' }
    ];

    // Delete existing categories not in the new list
    const existingCategories = await Category.findAll();
    const categoriesToDelete = existingCategories.filter(cat => !categoriesData.some(c => c.slug === cat.slug));

    // Delete posts associated with categories to be deleted
    for (const cat of categoriesToDelete) {
      const deletePostsQuery = 'DELETE FROM posts WHERE "categoryId" = $1';
      await db.none(deletePostsQuery, [cat.id]);
      console.log(`Deleted posts for category: ${cat.name}`);
    }

    // Now delete the categories
    for (const cat of categoriesToDelete) {
      await Category.delete(cat.id);
      console.log(`Deleted category: ${cat.name}`);
    }

    for (const cat of categoriesData) {
      const existing = await Category.findBySlug(cat.slug);
      if (!existing) {
        await Category.create(cat);
      }
    }
    console.log('Seeded categories');

    const news = await Category.findBySlug('news');

    const postsData = [
      {
        title: 'Welcome to Our News Platform',
        slug: 'welcome-to-our-news-platform',
        content: 'Stay updated with the latest news and developments. We bring you comprehensive coverage of current events, analysis, and insights.',
        categoryId: news?.id,
        author: 'Admin'
      },
      {
        title: 'Breaking News Updates',
        slug: 'breaking-news-updates',
        content: 'Get real-time updates on breaking news stories from around the world. Our team works around the clock to bring you the most important developments.',
        categoryId: news?.id,
        author: 'Admin'
      },
      {
        title: 'News Analysis and Commentary',
        slug: 'news-analysis-and-commentary',
        content: 'In-depth analysis and expert commentary on the most significant news stories. Understanding the context behind the headlines.',
        categoryId: news?.id,
        author: 'Admin'
      },
      {
        title: 'Latest News Roundup',
        slug: 'latest-news-roundup',
        content: 'A comprehensive roundup of the latest news stories. Stay informed with our curated selection of the most important updates.',
        categoryId: news?.id,
        author: 'Admin'
      }
    ];

    for (const p of postsData) {
      if (!p.categoryId) continue;
      const existing = await Post.findBySlug(p.slug);
      if (!existing) {
        await Post.create(p);
      }
    }
    console.log('Seeded posts');

    console.log('Seeding complete');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

run();
