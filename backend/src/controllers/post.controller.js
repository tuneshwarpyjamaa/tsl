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

