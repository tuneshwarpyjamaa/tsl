/**
 * Memory-safe in-memory caching system with proper cleanup
 * Designed to prevent memory leaks that cause localhost crashes
 */

class InMemoryCache {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes in milliseconds
    this.cleanupInterval = 30 * 1000; // Clean up expired entries every 30 seconds
    this.maxSize = 500; // STRICT LIMIT: Prevent unlimited cache growth (reduced from 1000)
    this.maxMemoryMB = 25; // STRICT LIMIT: Limit cache memory usage (reduced from 50MB)
    
    // Track cleanup interval for proper cleanup
    this.cleanupIntervalId = null;
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      evictions: 0
    };
    
    // Start cleanup process
    this.startCleanup();
  }

  /**
   * Set a value in the cache with size and memory limits
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Custom TTL in milliseconds (optional)
   */
  set(key, value, ttl = this.defaultTTL) {
    // Enforce size limit
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    // Check memory usage and evict if necessary
    this.checkMemoryUsage();

    const expiryTime = Date.now() + ttl;
    const cacheEntry = {
      value: this.cloneValue(value), // Clone to prevent circular references
      expiryTime,
      createdAt: Date.now(),
      size: this.calculateSize(value)
    };

    this.cache.set(key, cacheEntry);
    this.stats.sets++;
  }

  /**
   * Clone value to prevent circular references and memory leaks
   */
  cloneValue(value) {
    try {
      if (typeof value === 'object' && value !== null) {
        return JSON.parse(JSON.stringify(value));
      }
      return value;
    } catch (error) {
      // If cloning fails, return as-is (for non-serializable objects)
      return value;
    }
  }

  /**
   * Calculate approximate size of a value in bytes
   */
  calculateSize(value) {
    try {
      return JSON.stringify(value).length * 2; // Rough estimate in bytes
    } catch (error) {
      return 100; // Default size for non-serializable objects
    }
  }

  /**
   * Check memory usage and evict entries if over limit
   */
  checkMemoryUsage() {
    const currentMemoryKB = this.getEstimatedMemoryUsage() / 1024;
    const maxMemoryKB = this.maxMemoryMB * 1024;
    
    if (currentMemoryKB > maxMemoryKB) {
      this.evictByMemory();
    }
  }

  /**
   * Get estimated memory usage of cache
   */
  getEstimatedMemoryUsage() {
    let totalSize = 0;
    for (const item of this.cache.values()) {
      totalSize += item.size || 100; // Default size if not calculated
    }
    return totalSize;
  }

  /**
   * Evict oldest entries when cache is full (LRU-style)
   */
  evictOldest() {
    const entries = [...this.cache.entries()];
    entries.sort((a, b) => a[1].createdAt - b[1].createdAt);
    
    // Remove oldest 10% of entries
    const toRemove = Math.ceil(entries.length * 0.1);
    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(entries[i][0]);
      this.stats.evictions++;
    }
  }

  /**
   * Evict entries by memory usage when over memory limit
   */
  evictByMemory() {
    const entries = [...this.cache.entries()];
    entries.sort((a, b) => a[1].createdAt - b[1].createdAt);
    
    // Remove oldest 20% of entries to free up memory
    const toRemove = Math.ceil(entries.length * 0.2);
    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(entries[i][0]);
      this.stats.evictions++;
    }
  }

  /**
   * Get a value from the cache
   * @param {string} key - Cache key
   * @returns {any|null} - Cached value or null if not found/expired
   */
  get(key) {
    const cachedItem = this.cache.get(key);
    
    if (!cachedItem) {
      this.stats.misses++;
      return null;
    }

    // Check if item has expired
    if (Date.now() > cachedItem.expiryTime) {
      this.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
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
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.stats.deletes++;
    }
    return deleted;
  }

  /**
   * Clear all cache entries
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Clean up expired entries
   */
  cleanup() {
    const now = Date.now();
    const expiredKeys = [];
    
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiryTime) {
        expiredKeys.push(key);
      }
    }
    
    // Delete expired entries
    const deletedCount = expiredKeys.length;
    expiredKeys.forEach(key => this.cache.delete(key));
    
    if (deletedCount > 0) {
      console.log(`Cache cleanup: removed ${deletedCount} expired entries`);
    }
  }

  /**
   * Start automatic cleanup of expired entries
   */
  startCleanup() {
    if (this.cleanupIntervalId) {
      clearInterval(this.cleanupIntervalId);
    }
    
    this.cleanupIntervalId = setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);
  }

  /**
   * CRITICAL: Proper cleanup for application shutdown
   */
  destroy() {
    if (this.cleanupIntervalId) {
      clearInterval(this.cleanupIntervalId);
      this.cleanupIntervalId = null;
    }
    this.cache.clear();
    console.log('Cache destroyed and cleaned up');
  }

  /**
   * Get comprehensive cache statistics
   * @returns {object} - Cache statistics
   */
  getStats() {
    const now = Date.now();
    let totalItems = 0;
    let expiredItems = 0;
    let totalSize = 0;
    
    for (const [key, item] of this.cache) {
      totalItems++;
      totalSize += item.size || 100;
      if (now > item.expiryTime) {
        expiredItems++;
      }
    }

    const hitRate = this.stats.hits + this.stats.misses > 0 
      ? (this.stats.hits / (this.stats.hits + this.stats.misses) * 100).toFixed(2)
      : 0;

    return {
      totalItems,
      activeItems: totalItems - expiredItems,
      expiredItems,
      estimatedMemoryKB: Math.round(totalSize / 1024),
      cacheSize: this.cache.size,
      maxSize: this.maxSize,
      maxMemoryMB: this.maxMemoryMB,
      hitRate: `${hitRate}%`,
      stats: { ...this.stats }
    };
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

    // Check if cache is getting too large before caching
    if (this.cache.size >= this.maxSize * 0.9) {
      console.log('Cache near capacity, skipping cachePost');
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
    if (!posts || posts.length === 0) return;
    
    // Check cache capacity before caching list
    if (this.cache.size + posts.length > this.maxSize * 0.9) {
      console.log('Cache near capacity, skipping cachePostsList');
      return;
    }
    
    posts.forEach(post => {
      this.cachePost(post, ttl);
    });
  }

  /**
   * Pre-warm cache with popular articles (memory-safe version)
   * @param {string[]} slugs - Array of article slugs to pre-cache
   * @param {function} fetcher - Function to fetch article data
   */
  async preWarmCache(slugs, fetcher) {
    if (!slugs || slugs.length === 0) return;
    
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
}

// SINGLETON PATTERN - Ensure only one instance to prevent memory leaks
let cacheInstance = null;

export function getCache() {
  if (!cacheInstance) {
    cacheInstance = new InMemoryCache();
    
    // Register cleanup handlers for graceful shutdown
    if (typeof process !== 'undefined') {
      process.on('SIGTERM', () => {
        console.log('Received SIGTERM, cleaning up cache...');
        cacheInstance?.destroy();
      });
      
      process.on('SIGINT', () => {
        console.log('Received SIGINT, cleaning up cache...');
        cacheInstance?.destroy();
      });
    }
  }
  return cacheInstance;
}

// Export the singleton instance
export const articleCache = getCache();

// Cache key generators for consistent naming
export const cacheKeys = {
  post: (slug) => `post:${slug}`,
  postById: (id) => `post:id:${id}`,
  postsByCategory: (categorySlug) => `posts:category:${categorySlug}`,
  postsList: (page, limit) => `posts:list:${page}:${limit}`,
  searchResults: (query, page, limit) => `search:${query}:${page}:${limit}`,
  trendingPosts: () => 'posts:trending'
};

export { InMemoryCache };
export default articleCache;
