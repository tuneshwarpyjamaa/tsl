/**
 * In-memory caching system with TTL (Time To Live)
 * Designed for article caching to achieve sub-200ms loading times
 */

class InMemoryCache {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes in milliseconds
    this.cleanupInterval = 30 * 1000; // Clean up expired entries every 30 seconds
    
    // Start cleanup process
    this.startCleanup();
  }

  /**
   * Set a value in the cache with optional custom TTL
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Custom TTL in milliseconds (optional)
   */
  set(key, value, ttl = this.defaultTTL) {
    const expiryTime = Date.now() + ttl;
    this.cache.set(key, {
      value,
      expiryTime,
      createdAt: Date.now()
    });
  }

  /**
   * Get a value from the cache
   * @param {string} key - Cache key
   * @returns {any|null} - Cached value or null if not found/expired
   */
  get(key) {
    const cachedItem = this.cache.get(key);
    
    if (!cachedItem) {
      return null;
    }

    // Check if item has expired
    if (Date.now() > cachedItem.expiryTime) {
      this.delete(key);
      return null;
    }

    return cachedItem.value;
  }

  /**
   * Check if a key exists in cache and is not expired
   * @param {string} key - Cache key
   * @returns {boolean}
   */
  has(key) {
    const cachedItem = this.cache.get(key);
    
    if (!cachedItem) {
      return false;
    }

    if (Date.now() > cachedItem.expiryTime) {
      this.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete a specific key from cache
   * @param {string} key - Cache key to delete
   */
  delete(key) {
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   * @returns {object} - Cache statistics
   */
  getStats() {
    const now = Date.now();
    let totalItems = 0;
    let expiredItems = 0;
    
    for (const [key, item] of this.cache) {
      totalItems++;
      if (now > item.expiryTime) {
        expiredItems++;
      }
    }

    return {
      totalItems,
      activeItems: totalItems - expiredItems,
      expiredItems,
      memoryUsage: this.cache.size
    };
  }

  /**
   * Clean up expired entries
   */
  cleanup() {
    const now = Date.now();
    
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiryTime) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Start automatic cleanup of expired entries
   */
  startCleanup() {
    setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);
  }

  /**
   * Pre-warm cache with popular articles (for improved initial load times)
   * @param {string[]} slugs - Array of article slugs to pre-cache
   * @param {function} fetcher - Function to fetch article data
   */
  async preWarmCache(slugs, fetcher) {
    const promises = slugs.map(async (slug) => {
      try {
        const data = await fetcher(slug);
        this.set(`post:${slug}`, data);
        console.log(`Pre-cached article: ${slug}`);
      } catch (error) {
        console.warn(`Failed to pre-cache article ${slug}:`, error.message);
      }
    });

    await Promise.allSettled(promises);
  }

  /**
   * Cache article with optimized key structure
   * @param {object} postData - Post data from database
   * @param {number} ttl - Optional custom TTL
   */
  cachePost(postData, ttl = this.defaultTTL) {
    if (!postData || !postData.slug) {
      return;
    }

    // Cache by slug
    this.set(`post:${postData.slug}`, postData, ttl);
    
    // Cache by ID for additional lookup patterns
    if (postData.id) {
      this.set(`post:id:${postData.id}`, postData, ttl);
    }

    // Cache category-related queries
    if (postData.category_slug) {
      this.set(`posts:category:${postData.category_slug}`, postData, ttl);
    }
  }

  /**
   * Cache multiple posts (for list views)
   * @param {Array} posts - Array of post objects
   * @param {number} ttl - Optional custom TTL
   */
  cachePostsList(posts, ttl = this.defaultTTL) {
    posts.forEach(post => {
      this.cachePost(post, ttl);
    });
  }
}

// Create and export singleton instance
const articleCache = new InMemoryCache();

// Cache key generators for consistent naming
export const cacheKeys = {
  post: (slug) => `post:${slug}`,
  postById: (id) => `post:id:${id}`,
  postsByCategory: (categorySlug) => `posts:category:${categorySlug}`,
  postsList: (page, limit) => `posts:list:${page}:${limit}`,
  searchResults: (query, page, limit) => `search:${query}:${page}:${limit}`,
  trendingPosts: () => 'posts:trending'
};

export default articleCache;
export { InMemoryCache };