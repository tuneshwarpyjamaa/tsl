/**
 * Optimized post controller for sub-200ms article loading
 * Combines multiple queries into single API calls to eliminate round trips
 */

import { Post } from '../models/Post.js';
import { Category } from '../models/Category.js';
import articleCache, { cacheKeys } from '../lib/cache.js';

/**
 * Get complete post data including related posts and metadata in single call
 * This eliminates multiple API round trips for maximum performance
 */
export async function getCompletePost(req, res) {
  try {
    const { slug } = req.params;
    const startTime = Date.now();
    
    console.log(`[PERF] Starting optimized post fetch for: ${slug}`);
    
    // Check cache for complete post data first
    const cacheKey = `complete_post:${slug}`;
    const cachedData = articleCache.get(cacheKey);
    
    if (cachedData) {
      const loadTime = Date.now() - startTime;
      console.log(`[PERF] Cache hit for complete post: ${slug} (${loadTime}ms)`);
      return res.json({
        success: true,
        data: cachedData,
        meta: {
          source: 'cache',
          loadTime
        }
      });
    }
    
    console.log(`[PERF] Cache miss, querying database...`);
    
    // Get main post with category info (uses cache internally)
    const post = await Post.findBySlug(slug);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Get related posts from same category (request 4 to ensure 3 after filtering current post)
    const category = await Category.findBySlug(post.category_slug);
    const relatedPosts = category ?
      await Post.findByCategory(category.id, 4) : [];
    
    // Filter out the current post and format
    const formattedRelated = relatedPosts
      .filter(p => p.slug !== slug)
      .slice(0, 3)
      .map(p => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        author: p.author,
        image: p.image,
        createdAt: p.createdAt,
        category_name: p.category_name,
        category_slug: p.category_slug
      }));
    
    // Prepare complete response data
    const completeData = {
      post: {
        ...post,
        // Ensure consistent data structure
        categoryId: {
          name: post.category_name,
          slug: post.category_slug
        }
      },
      relatedPosts: formattedRelated,
      meta: {
        loadTime: Date.now() - startTime,
        relatedCount: formattedRelated.length
      }
    };
    
    // Cache the complete result for 5 minutes
    articleCache.set(cacheKey, completeData, 5 * 60 * 1000);
    
    const loadTime = Date.now() - startTime;
    console.log(`[PERF] Complete post loaded in: ${loadTime}ms`);
    
    res.json({
      success: true,
      data: completeData,
      meta: {
        source: 'database',
        loadTime
      }
    });
    
  } catch (error) {
    console.error('[PERF] Error in getCompletePost:', error);
    res.status(500).json({ 
      error: 'Failed to load post',
      details: error.message 
    });
  }
}

/**
 * Optimized list posts endpoint with enhanced caching
 */
export async function getOptimizedPostList(req, res) {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;
    
    const startTime = Date.now();
    
    // Check cache for list results
    const cacheKey = category ? 
      `post_list:${category}:${pageNum}:${limitNum}` :
      `post_list:all:${pageNum}:${limitNum}`;
    
    const cachedData = articleCache.get(cacheKey);
    
    if (cachedData) {
      const loadTime = Date.now() - startTime;
      console.log(`[PERF] Cache hit for post list: ${cacheKey} (${loadTime}ms)`);
      return res.json({
        success: true,
        data: cachedData,
        meta: { source: 'cache', loadTime }
      });
    }
    
    let posts;
    let totalCount;
    
    if (category) {
      // Get category first
      const categoryData = await Category.findBySlug(category);
      if (!categoryData) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      posts = await Post.findByCategory(categoryData.id, limitNum);
      totalCount = posts.length; // Simplified for performance
    } else {
      posts = await Post.findAll({ limit: limitNum, offset });
      totalCount = await Post.countAll();
    }
    
    // Format posts for consistent structure
    const formattedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content.substring(0, 200) + '...', // Truncated for list
      author: post.author,
      image: post.image,
      createdAt: post.createdAt,
      categoryId: {
        name: post.category_name,
        slug: post.category_slug
      }
    }));
    
    const result = {
      posts: formattedPosts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitNum)
      }
    };
    
    // Cache for 2 minutes
    articleCache.set(cacheKey, result, 2 * 60 * 1000);
    
    const loadTime = Date.now() - startTime;
    console.log(`[PERF] Post list loaded in: ${loadTime}ms`);
    
    res.json({
      success: true,
      data: result,
      meta: { 
        source: 'database',
        loadTime 
      }
    });
    
  } catch (error) {
    console.error('[PERF] Error in getOptimizedPostList:', error);
    res.status(500).json({ 
      error: 'Failed to load posts',
      details: error.message 
    });
  }
}
