import { Category } from '../models/Category.js';
import { Post } from '../models/Post.js';

export async function listCategories(_req, res) {
  const categories = await Category.findAll();
  res.json(categories);
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
    const featuredSlugs = ['technology', 'world-news', 'business'];

    // First, get all featured categories in one query
    const categories = await Category.findBySlugs(featuredSlugs);
    if (!categories || categories.length === 0) {
      return res.json([]);
    }

    const categoryMap = new Map(categories.map(c => [c.id, c]));
    const categoryIds = Array.from(categoryMap.keys());

    // Then, get the latest 5 posts for all those categories in a single, optimized query
    const posts = await Post.findLatestForCategories(categoryIds, 5);

    // Group the posts by category_id client-side
    const postsByCategory = posts.reduce((acc, post) => {
      if (!acc[post.category_id]) {
        acc[post.category_id] = [];
      }
      acc[post.category_id].push(post);
      return acc;
    }, {});

    // Finally, build the response object in the correct order
    const featuredData = categories.map(cat => {
      const categoryPosts = postsByCategory[cat.id] || [];
      return {
        name: cat.name,
        slug: cat.slug,
        posts: categoryPosts.map(p => ({
          ...p,
          categoryId: { name: cat.name, slug: cat.slug }
        })),
      };
    });

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
  } catch (e)
{
    res.status(500).json({ error: 'Failed to delete category' });
  }
}
