-- Migration: Add multi-habit check-in support
-- Run this ONCE against your D1 database:
-- npx wrangler d1 execute jieluxia-db --file=schema-migration.sql

-- 1. Recreate checkins table with new columns (SQLite doesn't support ALTER TABLE well)
CREATE TABLE IF NOT EXISTS checkins_new (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  habit_id TEXT NOT NULL DEFAULT 'default',
  date TEXT NOT NULL,
  checked_at TEXT DEFAULT (datetime('now')),
  value REAL DEFAULT 1,
  note TEXT
);

-- Migrate existing data: map checked_at -> date, set habit_id = 'default'
INSERT OR IGNORE INTO checkins_new (id, user_id, habit_id, date, checked_at, value, note)
SELECT id, user_id, 'default', checked_at, checked_at, 1, note FROM checkins;

-- Drop old table and rename
DROP TABLE IF EXISTS checkins;
ALTER TABLE checkins_new RENAME TO checkins;

-- 2. Create indexes
CREATE INDEX IF NOT EXISTS idx_checkins_user_date ON checkins(user_id, date);
CREATE INDEX IF NOT EXISTS idx_checkins_user_habit ON checkins(user_id, habit_id, date);

-- 3. Create new tables
CREATE TABLE IF NOT EXISTS user_goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  habit_id TEXT NOT NULL,
  target REAL NOT NULL,
  UNIQUE(user_id, habit_id)
);

CREATE TABLE IF NOT EXISTS custom_goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '🎯',
  color TEXT NOT NULL DEFAULT '#9cd6ee',
  daily_target REAL NOT NULL,
  unit TEXT NOT NULL DEFAULT '',
  deadline TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  category TEXT NOT NULL DEFAULT '',
  goal_type TEXT NOT NULL DEFAULT 'continuous',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_custom_goals_user ON custom_goals(user_id, status);

CREATE TABLE IF NOT EXISTS sleep_cycles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,
  wake_time TEXT,
  sleep_time TEXT
);

CREATE INDEX IF NOT EXISTS idx_sleep_cycles_user_date ON sleep_cycles(user_id, date);
