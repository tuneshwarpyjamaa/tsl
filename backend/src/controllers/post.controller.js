import slugify from 'slugify';
import { Post } from '../models/Post.js';
import { Category } from '../models/Category.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
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

export async function generateArticle(req, res) {
  try {
    const { query, count = 1, category = 'news' } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    // Validate count is between 1 and 10
    const articleCount = Math.min(10, Math.max(1, parseInt(count) || 1));
    
    // Execute the article script with the provided parameters
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const scriptPath = path.resolve(__dirname, '../../../article_script.py');
    const command = `python "${scriptPath}" "${query}" --count ${articleCount} --category "${category}"`;
    
    const { stdout, stderr } = await execAsync(command, { maxBuffer: 1024 * 1024 * 5 });
    
    if (stderr) {
      console.error('Error generating article:', stderr);
      return res.status(500).json({ error: 'Error generating article', details: stderr });
    }
    
    // Parse the output to get the generated articles
    let articles = [];
    try {
      // The script outputs JSON string for each article
      const lines = stdout.split('\n').filter(line => line.trim().startsWith('{'));
      articles = lines.map(line => JSON.parse(line));
    } catch (parseError) {
      console.error('Error parsing article output:', parseError);
      return res.status(500).json({ 
        error: 'Error parsing generated articles', 
        details: parseError.message,
        rawOutput: stdout
      });
    }
    
    res.json({ success: true, articles });
  } catch (error) {
    console.error('Failed to generate article:', error);
    res.status(500).json({ 
      error: 'Failed to generate article', 
      details: error.message 
    });
  }
}
