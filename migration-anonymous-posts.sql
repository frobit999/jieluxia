-- Migration: Add is_anonymous column to posts table
-- Run: npx wrangler d1 execute jieluxiad1 --file=migration-anonymous-posts.sql --remote

ALTER TABLE posts ADD COLUMN is_anonymous INTEGER NOT NULL DEFAULT 1;
