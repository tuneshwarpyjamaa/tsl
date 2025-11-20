-- Add meta_description column to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS meta_description TEXT;