import slugify from 'slugify';
import { Post } from '../models/Post.js';
import { Category } from '../models/Category.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
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
    const command = `python3 "${scriptPath}" "${query}" --count ${articleCount} --category "${category}"`;
    
    // Create a new env object with required variables
    const env = {
      ...process.env,
      PATH: process.env.PATH, // Keep the existing PATH
      OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
      NEWS_API_KEY: process.env.NEWS_API_KEY,
      DATABASE_URL: process.env.DATABASE_URL
    };
    
    console.log('Executing command:', command);
    console.log('Environment variables:', {
      hasOpenRouterKey: !!env.OPENROUTER_API_KEY,
      hasNewsApiKey: !!env.NEWS_API_KEY,
      hasDbUrl: !!env.DATABASE_URL
    });

    let stdout, stderr;
    try {
      const result = await execAsync(command, {
        maxBuffer: 1024 * 1024 * 10,
        env: env,
        shell: true,
        cwd: path.resolve(__dirname, '../../../') // Run from project root
      });
      stdout = result.stdout;
      stderr = result.stderr;
      
      console.log('Command output:', stdout);
      if (stderr) {
        console.error('Command stderr:', stderr);
      }
    } catch (error) {
      console.error('Command execution failed:', {
        error: error.message,
        stdout: error.stdout,
        stderr: error.stderr,
        code: error.code,
        signal: error.signal
      });
      return res.status(500).json({ 
        error: 'Failed to execute article generation script', 
        details: error.message,
        stdout: error.stdout,
        stderr: error.stderr
      });
    }
    
    // Parse the output to get the generated articles
    let articles = [];
    try {
      // First, check if the script output indicates success
      if (stdout.includes('Article stored in database:')) {
        // Extract the article title from the success message
        const titleMatch = stdout.match(/Article stored in database: (.+)/);
        const title = titleMatch ? titleMatch[1].trim() : 'Generated Article';
        
        // Create a simple article object with the title
        articles.push({
          title: title,
          content: 'Article has been generated and stored in the database.',
          success: true
        });
      } else if (stdout.includes('No articles were generated')) {
        return res.status(404).json({ 
          error: 'No articles were generated',
          details: 'The article generation process completed but no articles were created.'
        });
      } else {
        // Try to parse any JSON output as a fallback
        const jsonMatch = stdout.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const articleData = JSON.parse(jsonMatch[0]);
            articles.push(articleData);
          } catch (e) {
            console.error('Error parsing JSON output:', e);
          }
        }
      }
      
      if (articles.length === 0) {
        return res.status(500).json({ 
          error: 'Could not parse article output',
          details: 'The article generation process did not produce any parsable output.',
          rawOutput: stdout
        });
      }
      
      res.json({ success: true, articles });
      
    } catch (error) {
      console.error('Error processing article output:', error);
      res.status(500).json({ 
        error: 'Error processing generated articles', 
        details: error.message,
        rawOutput: stdout
      });
    }
  } catch (error) {
    console.error('Failed to generate article:', error);
    res.status(500).json({ 
      error: 'Failed to generate article', 
      details: error.message 
    });
  }
}
