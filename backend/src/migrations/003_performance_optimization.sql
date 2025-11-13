-- Performance optimization migration for sub-200ms article loading
-- This migration adds critical missing indexes to dramatically improve query performance

-- CRITICAL: Index for slug lookups (currently missing - major bottleneck)
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);

-- Index for category-based article queries
CREATE INDEX IF NOT EXISTS idx_posts_category_created ON posts("categoryId", "createdAt" DESC);

-- Index for author-based queries  
CREATE INDEX IF NOT EXISTS idx_posts_author_created ON posts("authorId", "createdAt" DESC);

-- Composite index for most common list queries
CREATE INDEX IF NOT EXISTS idx_posts_list_optimized ON posts("categoryId", "createdAt" DESC)
INCLUDE (title, slug, author, image);

-- Index for recent articles (trending)
CREATE INDEX IF NOT EXISTS idx_posts_recent ON posts("createdAt" DESC);

-- Index for search queries (title only for performance)
CREATE INDEX IF NOT EXISTS idx_posts_search_title ON posts(title);

-- Materialized view for instant article lists (optional but highly recommended)
CREATE MATERIALIZED VIEW IF NOT EXISTS posts_with_categories AS
SELECT 
    p.*, 
    c.name as category_name, 
    c.slug as category_slug
FROM posts p
LEFT JOIN categories c ON p."categoryId" = c.id
ORDER BY p."createdAt" DESC;

-- Index on the materialized view
CREATE INDEX IF NOT EXISTS idx_posts_view_recent ON posts_with_categories("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_posts_view_category ON posts_with_categories("categoryId", "createdAt" DESC);

-- Statistics for query planning
ANALYZE posts;
ANALYZE categories;
ANALYZE posts_with_categories;