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
