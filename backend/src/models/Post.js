import { db } from '../lib/db.js';
import articleCache, { cacheKeys } from '../lib/cache.js';

export class Post {
  static async create(data) {
    const { title, slug, content, categoryId, author = 'Admin', image, authorId } = data;
    const query = `
      INSERT INTO posts (title, slug, content, "categoryId", author, image, "authorId", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING id, title, slug, content, "categoryId", author, image, "authorId", "createdAt", "updatedAt"
    `;
    const newPost = await db.one(query, [title, slug, content, categoryId, author, image, authorId]);
    
    // Fetch category info and cache the new post
    const categoryQuery = `SELECT name, slug FROM categories WHERE id = $1`;
    const category = await db.one(categoryQuery, [categoryId]);
    const postWithCategory = {
      ...newPost,
      category_name: category.name,
      category_slug: category.slug
    };
    
    // Cache the new post and invalidate related cache
    articleCache.cachePost(postWithCategory);
    // Clear any cached list views since we have a new post
    articleCache.delete('posts:list:1:10'); // Clear first page cache
    articleCache.delete('posts:trending');
    
    return postWithCategory;
  }

  static async findAll({ limit = 10, offset = 0 } = {}) {
    // Check cache for common queries
    const cacheKey = cacheKeys.postsList(offset / limit + 1, limit);
    const cachedPosts = articleCache.get(cacheKey);
    
    if (cachedPosts) {
      console.log(`Cache hit for posts list: ${cacheKey}`);
      return cachedPosts;
    }
    
    const query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM posts p
      LEFT JOIN categories c ON p."categoryId" = c.id
      ORDER BY p."createdAt" DESC
      LIMIT $1 OFFSET $2
    `;
    const posts = await db.manyOrNone(query, [limit, offset]);
    
    // Cache the results
    if (posts && posts.length > 0) {
      articleCache.set(cacheKey, posts, 2 * 60 * 1000); // 2 minute cache for lists
      articleCache.cachePostsList(posts); // Cache individual posts
    }
    
    return posts;
  }

  static async countAll() {
    const query = 'SELECT COUNT(*) FROM posts';
    const result = await db.one(query);
    return parseInt(result.count, 10);
  }

  static async findRecent(limit = 5) {
    // Check cache for trending posts
    const cacheKey = `posts:trending:${limit}`;
    const cachedPosts = articleCache.get(cacheKey);
    
    if (cachedPosts) {
      console.log(`Cache hit for trending posts: ${cacheKey}`);
      return cachedPosts;
    }
    
    const query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM posts p
      LEFT JOIN categories c ON p."categoryId" = c.id
      ORDER BY p."createdAt" DESC
      LIMIT $1
    `;
    const posts = await db.many(query, [limit]);
    
    // Cache the results for 3 minutes
    if (posts && posts.length > 0) {
      articleCache.set(cacheKey, posts, 3 * 60 * 1000);
      articleCache.cachePostsList(posts); // Cache individual posts
    }
    
    return posts;
  }

  static async findBySlug(slug) {
    // Check cache first
    const cacheKey = cacheKeys.post(slug);
    const cachedPost = articleCache.get(cacheKey);
    
    if (cachedPost) {
      console.log(`Cache hit for post: ${slug}`);
      return cachedPost;
    }
    
    console.log(`Cache miss for post: ${slug}, querying database...`);
    const query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM posts p
      LEFT JOIN categories c ON p."categoryId" = c.id
      WHERE p.slug = $1
    `;
    const post = await db.one(query, [slug]);
    
    // Cache the result
    if (post) {
      articleCache.cachePost(post);
    }
    
    return post;
  }

  static async findById(id) {
    const query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM posts p
      LEFT JOIN categories c ON p."categoryId" = c.id
      WHERE p.id = $1
    `;
    return await db.one(query, [id]);
  }

  static async findByCategory(categoryId, limit) {
    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM posts p
      LEFT JOIN categories c ON p."categoryId" = c.id
      WHERE p."categoryId" = $1
      ORDER BY p."createdAt" DESC
    `;
    const params = [categoryId];
    if (limit) {
      query += ' LIMIT $2';
      params.push(limit);
    }
    return await db.many(query, params);
  }

  static async update(id, data) {
    const { title, slug, content, categoryId, author, image } = data;
    const query = `
      UPDATE posts
      SET title = $1, slug = $2, content = $3, "categoryId" = $4, author = $5, image = $6, "updatedAt" = NOW()
      WHERE id = $7
      RETURNING id, title, slug, content, "categoryId", author, image, "createdAt", "updatedAt"
    `;
    const updatedPost = await db.one(query, [title, slug, content, categoryId, author, image, id]);
    
    if (updatedPost) {
      // Fetch category info and cache the updated post
      const categoryQuery = `SELECT name, slug FROM categories WHERE id = $1`;
      const category = await db.one(categoryQuery, [categoryId]);
      const postWithCategory = {
        ...updatedPost,
        category_name: category.name,
        category_slug: category.slug
      };
      
      // Cache the updated post and invalidate related cache
      articleCache.cachePost(postWithCategory);
      articleCache.delete('posts:list:1:10'); // Clear list cache
      
      return postWithCategory;
    }
    
    return updatedPost;
  }

  static async delete(id) {
    // First get the post to invalidate cache
    const postToDelete = await this.findById(id);
    
    const query = 'DELETE FROM posts WHERE id = $1';
    const result = await db.none(query, [id]);
    
    // Invalidate cache entries
    if (postToDelete) {
      articleCache.delete(cacheKeys.post(postToDelete.slug));
      articleCache.delete(cacheKeys.postById(id));
      articleCache.delete('posts:list:1:10'); // Clear list cache
      articleCache.delete('posts:trending');
    }
    
    return result;
  }

  static async search(query, { limit = 10, offset = 0 } = {}) {
    const searchQuery = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM posts p
      LEFT JOIN categories c ON p."categoryId" = c.id
      WHERE p.title ILIKE $1 OR p.content ILIKE $1
      ORDER BY p."createdAt" DESC
      LIMIT $2 OFFSET $3
    `;
    return await db.manyOrNone(searchQuery, [`%${query}%`, limit, offset]);
  }

  static async countSearch(query) {
    const searchQuery = `
      SELECT COUNT(*)
      FROM posts
      WHERE title ILIKE $1 OR content ILIKE $1
    `;
    const result = await db.one(searchQuery, [`%${query}%`]);
    return parseInt(result.count, 10);
  }
}
