import { query, one, many, manyOrNone, any, none } from '../config/db.js';
import articleCache, { cacheKeys } from '../lib/cache.js';

export class Post {
  static async create(data) {
    const { title, slug, content, categoryId, author = 'Admin', image, authorId } = data;
    
    const queryText = `
      INSERT INTO posts (title, slug, content, "categoryId", author, image, "authorId", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING *
    `;
    
    const newPost = await one(queryText, [title, slug, content, categoryId, author, image, authorId]);
    
    if (newPost) {
      // Fetch category info with optimized single query
      const categoryQuery = `SELECT name, slug FROM categories WHERE id = $1`;
      const category = await one(categoryQuery, [categoryId]);
      
      const postWithCategory = {
        ...newPost,
        category_name: category.name,
        category_slug: category.slug
      };
      
      // Memory-aware caching with size checks
      const cacheStats = articleCache.getStats();
      if (cacheStats.activeItems < 800) { // Leave room for other operations
        articleCache.cachePost(postWithCategory);
      }
      
      // More specific cache invalidation instead of clearing entire lists
      this.invalidateRelatedCache(postWithCategory);
      
      return postWithCategory;
    }
    
    return newPost;
  }

  static async findAll({ limit = 10, offset = 0 } = {}) {
    // Check cache for common queries
    const cacheKey = cacheKeys.postsList(Math.floor(offset / limit) + 1, limit);
    const cachedPosts = articleCache.get(cacheKey);
    
    if (cachedPosts) {
      console.log(`Cache hit for posts list: ${cacheKey}`);
      return cachedPosts;
    }
    
    const queryText = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM posts p
      LEFT JOIN categories c ON p."categoryId" = c.id
      ORDER BY p."createdAt" DESC
      LIMIT $1 OFFSET $2
    `;
    const posts = await manyOrNone(queryText, [limit, offset]);
    
    // Memory-aware caching
    if (posts && posts.length > 0) {
      const cacheStats = articleCache.getStats();
      if (cacheStats.activeItems < 900) { // Leave room for list caching
        articleCache.set(cacheKey, posts, 2 * 60 * 1000); // 2 minute cache for lists
        articleCache.cachePostsList(posts); // Cache individual posts if space allows
      }
    }
    
    return posts;
  }

  static async countAll() {
    const queryText = 'SELECT COUNT(*) as count FROM posts';
    const result = await one(queryText);
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
    
    const queryText = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM posts p
      LEFT JOIN categories c ON p."categoryId" = c.id
      ORDER BY p."createdAt" DESC
      LIMIT $1
    `;
    const posts = await many(queryText, [limit]);
    
    // Cache the results for 3 minutes with memory checks
    if (posts && posts.length > 0) {
      const cacheStats = articleCache.getStats();
      if (cacheStats.activeItems < 950) {
        articleCache.set(cacheKey, posts, 3 * 60 * 1000);
        articleCache.cachePostsList(posts);
      }
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
    const queryText = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM posts p
      LEFT JOIN categories c ON p."categoryId" = c.id
      WHERE p.slug = $1
    `;
    const post = await one(queryText, [slug]);
    
    // Cache the result if space allows
    if (post) {
      const cacheStats = articleCache.getStats();
      if (cacheStats.activeItems < 1000) { // Leave room for other operations
        articleCache.cachePost(post);
      }
    }
    
    return post;
  }

  static async findById(id) {
    const queryText = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM posts p
      LEFT JOIN categories c ON p."categoryId" = c.id
      WHERE p.id = $1
    `;
    return await one(queryText, [id]);
  }

  static async findByCategory(categoryId, limit) {
    let queryText = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM posts p
      LEFT JOIN categories c ON p."categoryId" = c.id
      WHERE p."categoryId" = $1
      ORDER BY p."createdAt" DESC
    `;
    const params = [categoryId];
    
    if (limit) {
      queryText += ' LIMIT $2';
      params.push(limit);
    }
    
    return await many(queryText, params);
  }

  static async findLatestForCategories(categoryIds, limitPerCategory) {
    if (!categoryIds || categoryIds.length === 0) {
      return [];
    }

    const queryText = `
      WITH ranked_posts AS (
        SELECT
          p.*,
          c.name as category_name,
          c.slug as category_slug,
          ROW_NUMBER() OVER(PARTITION BY p."categoryId" ORDER BY p."createdAt" DESC) as rn
        FROM posts p
        JOIN categories c ON p."categoryId" = c.id
        WHERE p."categoryId" = ANY($1)
      )
      SELECT *
      FROM ranked_posts
      WHERE rn <= $2
      ORDER BY "categoryId", "createdAt" DESC;
    `;

    return await manyOrNone(queryText, [categoryIds, limitPerCategory]);
  }

  static async update(id, data) {
    const { title, slug, content, categoryId, author, image } = data;
    const queryText = `
      UPDATE posts
      SET title = $1, slug = $2, content = $3, "categoryId" = $4, author = $5, image = $6, "updatedAt" = NOW()
      WHERE id = $7
      RETURNING *
    `;
    const updatedPost = await one(queryText, [title, slug, content, categoryId, author, image, id]);
    
    if (updatedPost) {
      // Fetch category info
      const categoryQuery = `SELECT name, slug FROM categories WHERE id = $1`;
      const category = await one(categoryQuery, [categoryId]);
      const postWithCategory = {
        ...updatedPost,
        category_name: category.name,
        category_slug: category.slug
      };
      
      // Memory-aware caching
      const cacheStats = articleCache.getStats();
      if (cacheStats.activeItems < 900) {
        articleCache.cachePost(postWithCategory);
      }
      
      // Specific cache invalidation - only clear if post order changed
      if (title !== updatedPost.title) {
        // Title change affects search results
        articleCache.delete(`search:${updatedPost.slug}:1:10`); // If using search caching
      }
      
      return postWithCategory;
    }
    
    return updatedPost;
  }

  static async delete(id) {
    // Get the post first to clean up related cache entries
    const postToDelete = await this.findById(id);
    
    const queryText = 'DELETE FROM posts WHERE id = $1';
    await none(queryText, [id]);
    
    // Memory-aware cache cleanup
    if (postToDelete) {
      // Delete specific cache entries
      articleCache.delete(cacheKeys.post(postToDelete.slug));
      articleCache.delete(cacheKeys.postById(id));
      
      // Only clear list cache if this was a recent post (affects ordering)
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      if (new Date(postToDelete.createdAt) > twentyFourHoursAgo) {
        articleCache.delete('posts:list:1:10'); // Clear first page cache
        articleCache.delete('posts:trending:5'); // Clear trending cache
      }
    }
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
    return await manyOrNone(searchQuery, [`%${query}%`, limit, offset]);
  }

  static async countSearch(query) {
    const searchQuery = `
      SELECT COUNT(*) as count
      FROM posts
      WHERE title ILIKE $1 OR content ILIKE $1
    `;
    const result = await one(searchQuery, [`%${query}%`]);
    return parseInt(result.count, 10);
  }

  /**
   * Smart cache invalidation that only clears affected entries
   * This prevents the broad cache clearing that was causing performance issues
   */
  static invalidateRelatedCache(post) {
    try {
      // Only clear list cache for recent posts that might affect page 1
      const recentThreshold = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days
      if (new Date(post.createdAt) > recentThreshold) {
        articleCache.delete('posts:list:1:10');
        
        // Clear trending cache for very recent posts
        const dayThreshold = new Date(Date.now() - 24 * 60 * 60 * 1000);
        if (new Date(post.createdAt) > dayThreshold) {
          articleCache.delete('posts:trending:5');
        }
      }
      
      // Clear category-specific caches if relevant
      if (post.category_slug) {
        articleCache.delete(`post_list:${post.category_slug}:1:10`);
      }
      
    } catch (error) {
      console.warn('Error during cache invalidation:', error.message);
      // Don't let cache invalidation errors break the main operation
    }
  }

  /**
   * Get post statistics for monitoring
   */
  static async getStats() {
    const totalQuery = 'SELECT COUNT(*) as count FROM posts';
    const recentQuery = `
      SELECT COUNT(*) as count 
      FROM posts 
      WHERE "createdAt" > NOW() - INTERVAL '24 hours'
    `;
    const categoryQuery = `
      SELECT c.name, COUNT(p.id) as count
      FROM categories c
      LEFT JOIN posts p ON c.id = p."categoryId"
      GROUP BY c.id, c.name
      ORDER BY count DESC
      LIMIT 5
    `;
    
    const [total, recent, topCategories] = await Promise.all([
      one(totalQuery),
      one(recentQuery),
      many(categoryQuery)
    ]);
    
    return {
      total: parseInt(total.count, 10),
      recent24h: parseInt(recent.count, 10),
      topCategories,
      cacheStats: articleCache.getStats()
    };
  }
}
