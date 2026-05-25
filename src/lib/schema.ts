import { sqliteTable, text, integer, real, primaryKey } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  nickname: text("nickname").notNull().default("新人战士"),
  avatarEmoji: text("avatar_emoji").default("🛡️"),
  level: integer("level").default(1),
  title: text("title").default("新人"),
  createdAt: text("created_at").default("datetime('now')"),
  updatedAt: text("updated_at").default("datetime('now')"),
});

export const checkins = sqliteTable("checkins", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  habitId: text("habit_id").notNull().default("default"),
  date: text("date").notNull(),
  checkedAt: text("checked_at").default("datetime('now')"),
  value: real("value").default(1),
  note: text("note"),
});

export const userGoals = sqliteTable("user_goals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => users.id),
  habitId: text("habit_id").notNull(),
  target: real("target").notNull(),
}, (t) => ({
  userHabit: primaryKey({ columns: [t.userId, t.habitId] }),
}));

export const customGoals = sqliteTable("custom_goals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  icon: text("icon").notNull().default("🎯"),
  color: text("color").notNull().default("#9cd6ee"),
  dailyTarget: real("daily_target").notNull(),
  unit: text("unit").notNull().default(""),
  deadline: text("deadline").notNull(),
  status: text("status").notNull().default("active"),
  category: text("category").notNull().default(""),
  goalType: text("goal_type").notNull().default("continuous"),
  createdAt: text("created_at").default("datetime('now')"),
  updatedAt: text("updated_at").default("datetime('now')"),
});

export const sleepCycles = sqliteTable("sleep_cycles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => users.id),
  date: text("date").notNull(),
  wakeTime: text("wake_time"),
  sleepTime: text("sleep_time"),
});

export const posts = sqliteTable("posts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: text("created_at").default("datetime('now')"),
});

export const postLikes = sqliteTable("post_likes", {
  postId: text("post_id").notNull().references(() => posts.id),
  userId: text("user_id").notNull().references(() => users.id),
}, (t) => ({
  pk: primaryKey({ columns: [t.postId, t.userId] }),
}));

export type User = typeof users.$inferSelect;
export type Checkin = typeof checkins.$inferSelect;
export type UserGoal = typeof userGoals.$inferSelect;
export type CustomGoal = typeof customGoals.$inferSelect;
export type SleepCycle = typeof sleepCycles.$inferSelect;
export type Post = typeof posts.$inferSelect;
