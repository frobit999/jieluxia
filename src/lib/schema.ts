import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";

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
  checkedAt: text("checked_at").notNull(), // YYYY-MM-DD
  note: text("note"),
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
export type Post = typeof posts.$inferSelect;
