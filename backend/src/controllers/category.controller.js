import { Category } from '../models/Category.js';
import { Post } from '../models/Post.js';

export async function listCategories(_req, res) {
  try {
    const categories = await Category.findAll();
    res.json(categories || []);
  } catch (error) {
    console.error('Error in listCategories:', error);
    // Return empty array instead of error for better UX
    res.json([]);
  }
}

export async function getPostsByCategory(req, res) {
  const { slug } = req.params;
  const category = await Category.findBySlug(slug);
  if (!category) return res.status(404).json({ error: 'Category not found' });
  const posts = await Post.findByCategory(category.id);
  const normalized = posts.map((p) => ({
    ...p,
    categoryId: { name: category.name, slug: category.slug }
  }));
  res.json({ category: { name: category.name, slug: category.slug }, posts: normalized });
}

export async function getFeaturedCategories(req, res) {
  try {
    // Get specific featured categories: Business and Culture
    const business = await Category.findBySlug('business');
    const culture = await Category.findBySlug('culture');
    const featuredCategories = [business, culture].filter(Boolean);

    const categoryMap = new Map(featuredCategories.map(c => [c.id, c]));
    const categoryIds = Array.from(categoryMap.keys());

    // Get the latest 8 posts for all those categories
    let posts = [];
    try {
      // Check if findLatestForCategories exists before calling it
      if (typeof Post.findLatestForCategories === 'function') {
        posts = await Post.findLatestForCategories(categoryIds, 8);
      } else {
        throw new Error('Post.findLatestForCategories is not defined');
      }
    } catch (error) {
      console.warn('Post.findLatestForCategories failed or missing, trying alternative:', error.message);
      // Fallback: get latest posts for each category individually
      posts = [];
      for (const category of featuredCategories) {
        try {
          const categoryPosts = await Post.findByCategory(category.id, 8);
          // Ensure categoryPosts is an array
          if (Array.isArray(categoryPosts)) {
            posts.push(...categoryPosts.map(p => ({ ...p, category_id: category.id })));
          }
        } catch (categoryError) {
          console.warn(`Failed to get posts for category ${category.name}:`, categoryError.message);
        }
      }
    }

    // Group the posts by category id (support both column styles)
    const postsByCategory = posts.reduce((acc, post) => {
      const cid = post.categoryId ?? post.category_id; // handle both query variants
      if (!cid) return acc;
      if (!acc[cid]) {
        acc[cid] = [];
      }
      acc[cid].push(post);
      return acc;
    }, {});

    // Build the response object in the correct order
    const featuredData = featuredCategories.map(cat => {
      const categoryPosts = postsByCategory[cat.id] || [];
      return {
        name: cat.name,
        slug: cat.slug,
        posts: categoryPosts.slice(0, 3).map(p => ({
          ...p,
          categoryId: { name: cat.name, slug: cat.slug }
        })),
      };
    });

    console.log(`Successfully loaded featured categories: ${featuredData.length}`);
    res.json(featuredData);

  } catch (error) {
    console.error('Error in getFeaturedCategories:', error);
    res.status(500).json({
      error: 'Failed to load featured categories',
      details: error.message
    });
  }
}

