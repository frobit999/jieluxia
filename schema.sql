-- ── Core tables ──

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nickname TEXT NOT NULL DEFAULT '新人战士',
  avatar_emoji TEXT DEFAULT 'shield',
  level INTEGER DEFAULT 1,
  title TEXT DEFAULT '新人',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  is_anonymous INTEGER NOT NULL DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS post_likes (
  post_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  PRIMARY KEY (post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);

-- ── Habit check-in tables (multi-habit system) ──

CREATE TABLE IF NOT EXISTS checkins (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  habit_id TEXT NOT NULL DEFAULT 'default',
  date TEXT NOT NULL,
  checked_at TEXT DEFAULT (datetime('now')),
  value REAL DEFAULT 1,
  note TEXT
);

CREATE INDEX IF NOT EXISTS idx_checkins_user_date ON checkins(user_id, date);
CREATE INDEX IF NOT EXISTS idx_checkins_user_habit ON checkins(user_id, habit_id, date);

CREATE TABLE IF NOT EXISTS relapses (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,
  trigger TEXT NOT NULL DEFAULT '',
  mood TEXT NOT NULL DEFAULT '',
  note TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_relapses_user_date ON relapses(user_id, date DESC);

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
  icon TEXT NOT NULL DEFAULT 'target',
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
