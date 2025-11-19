import slugify from 'slugify';
import { Post } from '../models/Post.js';
import { Category } from '../models/Category.js';
export async function listPosts(req, res) {
  const { q, page = 1, limit = 10 } = req.query;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const offset = (pageNum - 1) * limitNum;

  let posts;
  let totalCount;

  if (q) {
    posts = await Post.search(q, { limit: limitNum, offset });
    totalCount = await Post.countSearch(q);
  } else {
    posts = await Post.findAll({ limit: limitNum, offset });
    totalCount = await Post.countAll();
  }

  // Normalize to match previous shape (categoryId -> category)
  const normalized = posts.map((p) => {
    return {
      ...p,
      categoryId: { name: p.category_name, slug: p.category_slug },
    };
  });

  res.json({
    data: normalized,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limitNum),
    },
  });
}

export async function getTrendingPosts(req, res) {
  const posts = await Post.findRecent(5);
  const normalized = posts.map((p) => ({
    ...p,
    categoryId: { name: p.category_name, slug: p.category_slug }
  }));
  res.json(normalized);
}

export async function getPost(req, res) {
  const { slug } = req.params;
  const post = await Post.findBySlug(slug);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  const normalized = { ...post, categoryId: { name: post.category_name, slug: post.category_slug } };
  res.json(normalized);
}

export async function createPost(req, res) {
  try {
    const { title, slug, content, categorySlug, author, image } = req.body;
    if (!title || !slug || !content || !categorySlug) return res.status(400).json({ error: 'Missing fields' });
    const category = await Category.findBySlug(categorySlug);
    if (!category) return res.status(400).json({ error: 'Category not found' });
    const exists = await Post.findBySlug(slug);
    if (exists) return res.status(409).json({ error: 'Slug already exists' });

    const created = await Post.create({
      title, slug, content, categoryId: category.id, author, image, authorId: req.user?.id
    });
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to create post' });
  }
}

export async function updatePost(req, res) {
  try {
    const { id } = req.params;
    const { title, slug, content, categorySlug, author, image } = req.body;
    const data = { title, slug, content, author, image };

    if (!slug) {
      return res.status(400).json({ error: 'Slug is required' });
    }
    // Ownership enforcement for contributors
    const role = String(req.user?.role || '').toLowerCase();
    const existing = await Post.findById(id).catch(() => null);
    if (!existing) return res.status(404).json({ error: 'Post not found' });
    if (role === 'contributor' && existing.authorId !== req.user?.id) {
      return res.status(403).json({ error: 'You can only manage your own posts.' });
    }
    if (categorySlug) {
      const category = await Category.findBySlug(categorySlug);
      if (!category) return res.status(400).json({ error: 'Category not found' });
      data.categoryId = category.id;
    }
    const updated = await Post.update(id, data);
    if (!updated) return res.status(404).json({ error: 'Post not found' });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to update post' });
  }
}

export async function deletePost(req, res) {
  try {
    const { id } = req.params;
    // Ownership enforcement for contributors
    const role = String(req.user?.role || '').toLowerCase();
    const existing = await Post.findById(id).catch(() => null);
    if (!existing) return res.status(404).json({ error: 'Post not found' });
    if (role === 'contributor' && existing.authorId !== req.user?.id) {
      return res.status(403).json({ error: 'You can only manage your own posts.' });
    }
    await Post.delete(id);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to delete post' });
  }
}

export async function generateArticle(req, res) {
  // 🧹 PYTHON GENERATION REMOVED TO ELIMINATE MEMORY LEAKS
  // This function previously spawned Python processes that caused memory leaks

  try {
    const { query, count = 1, category = 'news' } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    console.log('🧹 Python generation endpoint accessed but disabled for memory safety');
    console.log('Query:', query);
    console.log('Category:', category);

    // Return a helpful response instead of spawning Python processes
    return res.status(410).json({
      error: 'Article generation has been disabled',
      details: 'Python-based article generation has been permanently removed to eliminate memory leaks.',
      message: 'This feature previously caused browser crashes due to memory leaks.',
      alternative: 'Please create articles manually through the admin panel at /admin',
      instructions: [
        '1. Go to /admin in your browser',
        '2. Navigate to Posts section',
        '3. Click "Create New Post"',
        '4. Fill in title, content, and category',
        '5. Save your article'
      ],
      query: query,
      category: category
    });

  } catch (error) {
    console.error('Error in generateArticle endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message,
      note: 'This endpoint now simply returns an error message to prevent memory leaks'
    });
  }
}
