import slugify from 'slugify';
import { Post } from '../models/Post.js';
import { Category } from '../models/Category.js';
export async function listPosts(req, res) {
  const { q } = req.query;
  let posts;
  if (q) {
    posts = await Post.search(q);
  } else {
    posts = await Post.findAll();
  }
  // Normalize to match previous shape (categoryId -> category)
  const normalized = posts.map((p) => ({
    ...p,
    categoryId: { name: p.category_name, slug: p.category_slug }
  }));
  res.json(normalized);
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
    const { title, content, categorySlug, author, image } = req.body;
    const data = { title, content, author, image };
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
