# 戒撸侠 (NoFap Hero) — CLAUDE.md

## 项目概述

戒撸侠是一个戒撸/自律打卡网站，核心功能是帮助用户记录戒撸天数、每日签到、查看身心改善数据。社区功能支持匿名发帖（默认匿名）。**不要往里面塞通用习惯追踪功能（喝水、运动、蜘蛛网图等），这个网站只需要戒撸相关的核心功能。**

## 技术栈

- **框架**: Next.js 15 App Router (`node_modules/next/dist/docs/` 有 breaking changes 文档，写代码前先读)
- **React**: 18.3
- **样式**: Tailwind CSS v4 + CSS 自定义属性（`var(--color-*)`）
- **数据库**: Cloudflare D1 (SQLite)
- **部署**: Cloudflare Pages via `@opennextjs/cloudflare`
- **数据获取**: SWR + 自定义 `apiGet/apiPost/apiPut/apiDelete` 封装
- **认证**: JWT（`jose` 库）+ HTTP-only cookie

## 设计语言

严格遵循 ElevenLabs 无色彩设计体系，完整参考在 `ElevenLabs_DESIGN.md`。

### 核心规则
- **色彩**: 全部使用 `var(--color-*)` CSS 变量，禁止使用饱和色做文字/背景/按钮
  - `--color-eggshell` (#fdfcfc) — 页面背景
  - `--color-powder` (#f5f3f1) — 次级表面、hover
  - `--color-chalk` (#e5e5e5) — 所有边框、分割线
  - `--color-gravel` (#777169) — 次级文字
  - `--color-slate` (#a59f97) — 三级文字
  - `--color-obsidian` (#000000) — 主文字、CTA 按钮背景
- **字体**: 标题用 `'Cormorant Garamond', Georgia, serif` weight 300；正文用 Inter 400/500
- **圆角**: 按钮/标签 9999px；卡片 16px；输入框 0px（底线边框风格）
- **阴影**: 卡片用 `rgba(0,0,0,0.4) 0px 0px 1.143px`，极轻阴影
- **按钮**: 黑色药丸按钮（PrimaryButton）+ 白色幽灵按钮（SecondaryButton）

### CSS 类名（globals.css）
- `.card` — 白色卡片 + 轻阴影
- `.section-label` — 眉毛标签（14px gravel）
- `.heading-display` — 48px Cormorant 300
- `.heading-section` — 32px Cormorant 300
- `.heading-sub` — 24px Cormorant 300
- `.text-body` — 14px 正文
- `.input-field` — 白底带边框输入
- `.input-bare` — 透明底线输入
- `.pill` — 药丸标签

## 项目结构

```
src/
├── app/
│   ├── (app)/                    # 需要登录的页面
│   │   ├── layout.tsx            # Navbar + BottomNav 包裹
│   │   ├── dashboard/page.tsx    # 仪表盘（戒撸核心：连续天数、签到、好处、周报、语录）
│   │   ├── community/page.tsx    # 战友社区（发帖、点赞、删除自己的帖子）
│   │   ├── records/page.tsx      # 打卡记录
│   │   ├── settings/page.tsx     # 个人设置
│   │   └── habits/page.tsx       # 习惯追踪（独立页面，不在主导航中）
│   ├── (auth)/                   # 登录/注册
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── api/
│   │   ├── auth/                 # 登录、注册、登出、获取用户
│   │   ├── checkin/              # 戒撸签到（POST 签到，GET 历史）
│   │   ├── checkin/today/        # 今日是否已签到
│   │   ├── streak/               # 连续天数
│   │   ├── stats/                # 周统计数据 + 活跃人数
│   │   ├── community/            # 帖子 CRUD + 点赞
│   │   ├── profile/              # 用户资料
│   │   └── habits/               # 多习惯系统 API（独立功能）
│   ├── layout.tsx                # 根布局（字体、metadata）
│   └── globals.css               # 设计 token + 全局样式
├── components/
│   ├── ui/                       # Button, BottomSheet, GlassCard, ProgressBar
│   ├── Navbar.tsx                # 桌面导航
│   ├── BottomNav.tsx             # 移动端底部导航
│   ├── StreakRing.tsx            # 戒撸天数环形图
│   ├── MilestoneBar.tsx          # 里程碑进度条
│   ├── CheckInButton.tsx         # 每日签到按钮 + BottomSheet 确认
│   ├── BenefitGrid.tsx           # 身心改善卡片
│   ├── WeeklyChart.tsx           # 本周打卡柱状图
│   ├── QuoteCard.tsx             # 每日一句
│   ├── CommunityPost.tsx         # 社区帖子组件
│   └── habits/                   # 习惯追踪相关组件（独立模块）
├── hooks/
│   ├── useUser.ts                # SWR 获取当前用户
│   ├── useHabits.ts              # 习惯打卡数据
│   ├── useSleepCycles.ts         # 睡眠周期
│   └── useCustomGoals.ts         # 自定义目标
├── lib/
│   ├── api.ts                    # apiGet/apiPost/apiPut/apiDelete 封装
│   ├── db.ts                     # getDB() + getJWTSecret()（Cloudflare 绑定）
│   ├── auth.ts                   # 密码哈希(PBKDF2)、JWT 签名/验证、getUser()
│   ├── streak.ts                 # calcStreak() + getLevel()
│   ├── schema.ts                 # Drizzle ORM schema 定义
│   ├── habits.ts                 # 习惯常量和工具函数
│   ├── customGoals.ts            # 自定义目标工具
│   ├── quotes.ts                 # 每日语录
│   └── trends.ts                 # 趋势数据计算
└── middleware.ts                  # 路由守卫（检查 cookie，重定向）
```

## 关键模式

### API 路由认证
```typescript
const db = getDB();
const secret = getJWTSecret();
const user = await getUser(db, request, secret);
if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });
// user.id 类型是 unknown，需要 String(user.id)
```

### 数据获取
```typescript
const { data } = useSWR<Type>("/api/xxx", apiGet);
```

### 页面过渡动画
全屏子页面使用 `translateX` 滑入/滑出：
```typescript
const [exiting, setExiting] = useState(false);
const goBack = () => { setExiting(true); timerRef.current = setTimeout(onBack, 300); };
// style={{ transform: exiting ? "translateX(100%)" : "translateX(0)", transition: "transform 0.3s ease" }}
```

### 社区帖子匿名
posts 表有 `is_anonymous` 列（INTEGER, 默认 1）。API 返回时根据此字段决定显示真实昵称还是"匿名"。

## 数据库

- D1 数据库名: `jieluxiad1`
- 迁移命令: `npx wrangler d1 execute jieluxiad1 --file=xxx.sql --remote`
- schema 定义在 `schema.sql`（原始 SQL）和 `src/lib/schema.ts`（Drizzle ORM）
- 迁移文件: `schema-migration.sql`, `migration-anonymous-posts.sql`

### 核心表
- `users` — 用户（id, email, password_hash, nickname, avatar_emoji, level, title）
- `checkins` — 打卡记录（id, user_id, habit_id, date, value, note）
- `posts` — 社区帖子（id, user_id, content, is_anonymous）
- `post_likes` — 点赞（post_id, user_id 联合主键）

## 部署

```bash
# 本地开发
npm run dev

# 构建检查
npm run build

# 部署到 Cloudflare Pages
npm run cf:deploy

# 推送代码
git push
```

## 重要注意事项

1. **不要添加通用习惯功能** — 这是戒撸网站，不是通用习惯追踪器
2. **设计语言必须一致** — 所有新组件用 `var(--color-*)` 变量，遵循 ElevenLabs 无色彩体系
3. **Next.js 15 breaking changes** — 写代码前先读 `node_modules/next/dist/docs/`
4. **user.id 是 unknown 类型** — 必须用 `String(user.id)` 转换
5. **社区默认匿名** — 发帖时 isAnonymous 默认 true
6. **middleware 只检查 cookie 存在** — JWT 签名验证在 API 路由内完成
