# 戒撸侠

自律打卡应用 — 每日签到、连续打卡、社区交流。

## 技术栈

- Next.js 15 (App Router) + React 18
- Cloudflare Pages + Workers (via OpenNext adapter)
- Cloudflare D1 (SQLite)
- Tailwind CSS v4
- TypeScript

## 开发

```bash
npm install
npm run dev
```

访问 http://localhost:3000

## 部署

```bash
npm run cf:build
npm run cf:deploy
```

## 项目结构

```
src/
├── app/
│   ├── (app)/          # 已认证页面 (dashboard, records, community, settings)
│   ├── (auth)/         # 公开页面 (login, register)
│   └── api/            # API 路由
├── components/         # UI 组件
├── hooks/              # SWR 数据钩子
├── lib/                # 核心逻辑 (auth, db, streak, api)
└── middleware.ts       # 认证中间件
```
