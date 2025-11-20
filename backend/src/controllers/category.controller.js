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
    // Dynamic approach: Get any available categories instead of hardcoded slugs
    const categories = await Category.findAll();

    if (!categories || categories.length === 0) {
      console.log('No categories found in database');
      return res.json([]);
    }

    // Take first 3 categories as "featured" if specific ones don't exist
    const featuredCategories = categories.slice(0, 3);

    const categoryMap = new Map(featuredCategories.map(c => [c.id, c]));
    const categoryIds = Array.from(categoryMap.keys());

    // Get the latest 5 posts for all those categories
    let posts = [];
    try {
      // Check if findLatestForCategories exists before calling it
      if (typeof Post.findLatestForCategories === 'function') {
        posts = await Post.findLatestForCategories(categoryIds, 5);
      } else {
        throw new Error('Post.findLatestForCategories is not defined');
      }
    } catch (error) {
      console.warn('Post.findLatestForCategories failed or missing, trying alternative:', error.message);
      // Fallback: get latest posts for each category individually
      posts = [];
      for (const category of featuredCategories) {
        try {
          const categoryPosts = await Post.findByCategory(category.id, 5);
          // Ensure categoryPosts is an array
          if (Array.isArray(categoryPosts)) {
            posts.push(...categoryPosts.map(p => ({ ...p, category_id: category.id })));
          }
        } catch (categoryError) {
          console.warn(`Failed to get posts for category ${category.name}:`, categoryError.message);
        }
      }
    }

    // Group the posts by category_id client-side
    const postsByCategory = posts.reduce((acc, post) => {
      if (!acc[post.category_id]) {
        acc[post.category_id] = [];
      }
      acc[post.category_id].push(post);
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

export async function createCategory(req, res) {
  try {
    const { name } = req.body;
    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create category' });
  }
}

export async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await Category.update(id, { name });
    res.json(category);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update category' });
  }
}

export async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    await Category.delete(id);
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
}
