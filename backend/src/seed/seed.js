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
      { name: 'Core Analysis', slug: 'core-analysis' },
      { name: 'The Long View', slug: 'the-long-view' },
      { name: 'The Archive', slug: 'the-archive' }
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

    const coreAnalysis = await Category.findBySlug('core-analysis');
    const longView = await Category.findBySlug('the-long-view');
    const archive = await Category.findBySlug('the-archive');

    const postsData = [
      {
        title: 'Welcome to Core Analysis',
        slug: 'welcome-to-core-analysis',
        content: 'Direct, strong analysis dissecting complex policies, geopolitics, and economies. For long-term perspectives, check out The Long View on Trends. Also, explore the Archive of Reference Materials for background information.',
        categoryId: coreAnalysis?.id,
        author: 'Admin'
      },
      {
        title: 'The Long View on Trends',
        slug: 'the-long-view-on-trends',
        content: 'Non-reactive focus on long-term trends, future policy implications, and emerging technology shifts. This complements the Welcome to Core Analysis approach. See Additional Core Analysis for more detailed breakdowns.',
        categoryId: longView?.id,
        author: 'Admin'
      },
      {
        title: 'Archive of Reference Materials',
        slug: 'archive-of-reference-materials',
        content: 'Curated collection of background papers, reading lists, and research materials. Useful for understanding the context in Welcome to Core Analysis and The Long View on Trends.',
        categoryId: archive?.id,
        author: 'Admin'
      },
      {
        title: 'Additional Core Analysis',
        slug: 'additional-core-analysis',
        content: 'Further dissection of economic policies and geopolitical strategies. Builds on the foundation from Welcome to Core Analysis. For archival references, visit Archive of Reference Materials.',
        categoryId: coreAnalysis?.id,
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
