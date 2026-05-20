// jieluxia Cloudflare Worker - 单文件后端
// 部署: wrangler deploy

// ── Auth 工具函数 ──

async function hashPassword(password) {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" }, key, 256);
  const toHex = (a) => [...a].map(b => b.toString(16).padStart(2, "0")).join("");
  return `${toHex(salt)}:${toHex(new Uint8Array(bits))}`;
}

async function verifyPassword(password, stored) {
  const [saltHex, hashHex] = stored.split(":");
  const salt = new Uint8Array(saltHex.match(/.{2}/g).map(b => parseInt(b, 16)));
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" }, key, 256);
  return [...new Uint8Array(bits)].map(b => b.toString(16).padStart(2, "0")).join("") === hashHex;
}

function b64url(data) {
  const str = typeof data === "string" ? data : String.fromCharCode(...data);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64urlDecode(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  return new Uint8Array([...atob(s)].map(c => c.charCodeAt(0)));
}

async function signToken(userId, secret) {
  const h = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const p = b64url(JSON.stringify({ sub: userId, iat: Date.now() / 1000 | 0, exp: Date.now() / 1000 + 2592000 }));
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(`${h}.${p}`));
  return `${h}.${p}.${b64url(new Uint8Array(sig))}`;
}

async function verifyToken(token, secret) {
  try {
    const [h, p, s] = token.split(".");
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const ok = await crypto.subtle.verify("HMAC", key, b64urlDecode(s), enc.encode(`${h}.${p}`));
    if (!ok) return null;
    const d = JSON.parse(new TextDecoder().decode(b64urlDecode(p)));
    return d.exp > Date.now() / 1000 ? d.sub : null;
  } catch { return null; }
}

function genId() { return crypto.randomUUID().replace(/-/g, "").slice(0, 21); }

// ── Streak 计算 ──

function calcStreak(dates) {
  if (!dates.length) return { current: 0, longest: 0 };
  const sorted = [...dates].sort().reverse();
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  let current = 0;
  const start = sorted[0] === today ? today : sorted[0] === yesterday ? yesterday : null;
  if (start) {
    let d = start;
    for (const date of sorted) {
      if (date === d) { current++; const t = new Date(d + "T00:00:00Z"); t.setUTCDate(t.getUTCDate() - 1); d = t.toISOString().slice(0, 10); }
      else if (date < d) break;
    }
  }

  let longest = 0, streak = 1;
  const asc = [...sorted].reverse();
  for (let i = 1; i < asc.length; i++) {
    const diff = (new Date(asc[i] + "T00:00:00Z") - new Date(asc[i - 1] + "T00:00:00Z")) / 86400000;
    if (diff === 1) streak++; else { longest = Math.max(longest, streak); streak = 1; }
  }
  return { current, longest: Math.max(longest, streak) };
}

function getLevel(s) {
  if (s >= 180) return { level: 7, title: "传奇" };
  if (s >= 90) return { level: 6, title: "大师" };
  if (s >= 60) return { level: 5, title: "精英" };
  if (s >= 30) return { level: 4, title: "战士" };
  if (s >= 14) return { level: 3, title: "坚持者" };
  if (s >= 7) return { level: 2, title: "初心者" };
  return { level: 1, title: "新人" };
}

// ── 路由 ──

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function cors(resp) {
  resp.headers.set("Access-Control-Allow-Origin", "*");
  resp.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  resp.headers.set("Access-Control-Allow-Headers", "Content-Type");
  resp.headers.set("Access-Control-Allow-Credentials", "true");
  return resp;
}

async function getUser(DB, req) {
  const cookie = req.headers.get("Cookie") || "";
  const m = cookie.match(/token=([^;]+)/);
  if (!m) return null;
  const userId = await verifyToken(m[1], globalThis.JWT_SECRET);
  if (!userId) return null;
  return await DB.prepare("SELECT * FROM users WHERE id=?").bind(userId).first();
}

export default {
  async fetch(req, env) {
    globalThis.JWT_SECRET = env.JWT_SECRET;
    const DB = env.DB;
    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    if (method === "OPTIONS") return cors(new Response(null, { status: 204 }));

    try {
      // ── Auth ──
      if (path === "/api/auth/register" && method === "POST") {
        const { email, password, nickname } = await req.json();
        if (!email || !password) return cors(json({ error: "邮箱和密码不能为空" }, 400));
        if (password.length < 6) return cors(json({ error: "密码至少6位" }, 400));
        const exists = await DB.prepare("SELECT id FROM users WHERE email=?").bind(email).first();
        if (exists) return cors(json({ error: "该邮箱已注册" }, 400));
        const id = genId();
        await DB.prepare("INSERT INTO users(id,email,password_hash,nickname) VALUES(?,?,?,?)")
          .bind(id, email, await hashPassword(password), nickname || "新人战士").run();
        const token = await signToken(id, env.JWT_SECRET);
        const resp = json({ user: { id, email, nickname: nickname || "新人战士", avatarEmoji: "🛡️", level: 1, title: "新人" } });
        resp.headers.set("Set-Cookie", `token=${token}; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000; Path=/`);
        return cors(resp);
      }

      if (path === "/api/auth/login" && method === "POST") {
        const { email, password } = await req.json();
        if (!email || !password) return cors(json({ error: "邮箱和密码不能为空" }, 400));
        const user = await DB.prepare("SELECT * FROM users WHERE email=?").bind(email).first();
        if (!user || !await verifyPassword(password, user.password_hash)) return cors(json({ error: "邮箱或密码错误" }, 400));
        const token = await signToken(user.id, env.JWT_SECRET);
        const resp = json({ user: { id: user.id, email: user.email, nickname: user.nickname, avatarEmoji: user.avatar_emoji, level: user.level, title: user.title } });
        resp.headers.set("Set-Cookie", `token=${token}; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000; Path=/`);
        return cors(resp);
      }

      if (path === "/api/auth/logout" && method === "POST") {
        const resp = json({ ok: true });
        resp.headers.set("Set-Cookie", "token=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/");
        return cors(resp);
      }

      if (path === "/api/auth/me" && method === "GET") {
        const user = await getUser(DB, req);
        if (!user) return cors(json({ user: null }, 401));
        return cors(json({ user: { id: user.id, email: user.email, nickname: user.nickname, avatarEmoji: user.avatar_emoji, level: user.level, title: user.title } }));
      }

      // ── Check-in ──
      if (path === "/api/checkin" && method === "POST") {
        const user = await getUser(DB, req);
        if (!user) return cors(json({ error: "未登录" }, 401));
        const today = new Date().toISOString().slice(0, 10);
        const exist = await DB.prepare("SELECT id FROM checkins WHERE user_id=? AND checked_at=?").bind(user.id, today).first();
        if (exist) return cors(json({ error: "今日已打卡" }, 400));
        const id = genId();
        const body = await req.json().catch(() => ({}));
        await DB.prepare("INSERT INTO checkins(id,user_id,checked_at,note) VALUES(?,?,?,?)").bind(id, user.id, today, body.note || null).run();
        const all = await DB.prepare("SELECT checked_at FROM checkins WHERE user_id=?").bind(user.id).all();
        const dates = all.results.map(r => r.checked_at);
        const { longest } = calcStreak(dates);
        const { level, title } = getLevel(longest);
        await DB.prepare("UPDATE users SET level=?,title=?,updated_at=datetime('now') WHERE id=?").bind(level, title, user.id).run();
        return cors(json({ checkin: { id, checkedAt: today }, streak: calcStreak([...dates, today]).current }));
      }

      if (path === "/api/checkin" && method === "GET") {
        const user = await getUser(DB, req);
        if (!user) return cors(json({ error: "未登录" }, 401));
        const month = url.searchParams.get("month");
        let q = "SELECT * FROM checkins WHERE user_id=?";
        const params = [user.id];
        if (month) { q += " AND checked_at LIKE ?"; params.push(`${month}%`); }
        q += " ORDER BY checked_at DESC";
        const r = await DB.prepare(q).bind(...params).all();
        return cors(json({ checkins: r.results }));
      }

      if (path === "/api/checkin/today" && method === "GET") {
        const user = await getUser(DB, req);
        if (!user) return cors(json({ checkedIn: false }));
        const today = new Date().toISOString().slice(0, 10);
        const e = await DB.prepare("SELECT id FROM checkins WHERE user_id=? AND checked_at=?").bind(user.id, today).first();
        return cors(json({ checkedIn: !!e }));
      }

      // ── Streak ──
      if (path === "/api/streak" && method === "GET") {
        const user = await getUser(DB, req);
        if (!user) return cors(json({ error: "未登录" }, 401));
        const all = await DB.prepare("SELECT checked_at FROM checkins WHERE user_id=?").bind(user.id).all();
        return cors(json(calcStreak(all.results.map(r => r.checked_at))));
      }

      // ── Stats ──
      if (path === "/api/stats" && method === "GET") {
        const user = await getUser(DB, req);
        if (!user) return cors(json({ error: "未登录" }, 401));
        const range = url.searchParams.get("range") || "week";
        const today = new Date();
        const todayStr = today.toISOString().slice(0, 10);

        if (range === "week") {
          const labels = ["一", "二", "三", "四", "五", "六", "日"];
          const dow = today.getDay();
          const mon = new Date(today);
          mon.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
          const week = [];
          for (let i = 0; i < 7; i++) {
            const d = new Date(mon); d.setDate(mon.getDate() + i);
            const ds = d.toISOString().slice(0, 10);
            const c = await DB.prepare("SELECT id FROM checkins WHERE user_id=? AND checked_at=?").bind(user.id, ds).first();
            week.push({ day: labels[i], value: c ? 85 : 15 });
          }
          return cors(json({ weekly: week }));
        }

        const month = url.searchParams.get("month") || todayStr.slice(0, 7);
        const r = await DB.prepare("SELECT checked_at FROM checkins WHERE user_id=? AND checked_at LIKE ?").bind(user.id, `${month}%`).all();
        const active = await DB.prepare("SELECT COUNT(DISTINCT user_id) as c FROM checkins WHERE checked_at=?").bind(todayStr).first();
        return cors(json({ checkins: r.results.map(x => x.checked_at), activeCount: active?.c || 0 }));
      }

      // ── Community ──
      if (path === "/api/community" && method === "GET") {
        const user = await getUser(DB, req);
        if (!user) return cors(json({ error: "未登录" }, 401));
        const page = +(url.searchParams.get("page") || 1);
        const limit = +(url.searchParams.get("limit") || 20);
        const offset = (page - 1) * limit;
        const r = await DB.prepare(
          "SELECT p.id,p.content,p.created_at,u.nickname,u.avatar_emoji FROM posts p LEFT JOIN users u ON p.user_id=u.id ORDER BY p.created_at DESC LIMIT ? OFFSET ?"
        ).bind(limit, offset).all();
        const posts = await Promise.all(r.results.map(async p => {
          const lc = await DB.prepare("SELECT COUNT(*) as c FROM post_likes WHERE post_id=?").bind(p.id).first();
          return { id: p.id, content: p.content, createdAt: p.created_at, nickname: p.nickname || "匿名", avatarEmoji: p.avatar_emoji || "🛡️", likeCount: lc?.c || 0 };
        }));
        const total = await DB.prepare("SELECT COUNT(*) as c FROM posts").first();
        return cors(json({ posts, total: total?.c || 0 }));
      }

      if (path === "/api/community" && method === "POST") {
        const user = await getUser(DB, req);
        if (!user) return cors(json({ error: "未登录" }, 401));
        const { content } = await req.json();
        if (!content?.trim()) return cors(json({ error: "内容不能为空" }, 400));
        const id = genId();
        await DB.prepare("INSERT INTO posts(id,user_id,content) VALUES(?,?,?)").bind(id, user.id, content.trim()).run();
        return cors(json({ post: { id, content: content.trim(), createdAt: new Date().toISOString(), nickname: user.nickname, avatarEmoji: user.avatar_emoji } }));
      }

      if (path.match(/^\/api\/community\/[^/]+\/like$/) && method === "POST") {
        const user = await getUser(DB, req);
        if (!user) return cors(json({ error: "未登录" }, 401));
        const postId = path.split("/")[3];
        const exist = await DB.prepare("SELECT * FROM post_likes WHERE post_id=? AND user_id=?").bind(postId, user.id).first();
        if (exist) await DB.prepare("DELETE FROM post_likes WHERE post_id=? AND user_id=?").bind(postId, user.id).run();
        else await DB.prepare("INSERT INTO post_likes(post_id,user_id) VALUES(?,?)").bind(postId, user.id).run();
        const lc = await DB.prepare("SELECT COUNT(*) as c FROM post_likes WHERE post_id=?").bind(postId).first();
        return cors(json({ liked: !exist, likeCount: lc?.c || 0 }));
      }

      // ── Profile ──
      if (path === "/api/profile" && method === "GET") {
        const user = await getUser(DB, req);
        if (!user) return cors(json({ error: "未登录" }, 401));
        const all = await DB.prepare("SELECT checked_at FROM checkins WHERE user_id=?").bind(user.id).all();
        const { current, longest } = calcStreak(all.results.map(r => r.checked_at));
        return cors(json({ user: { id: user.id, email: user.email, nickname: user.nickname, avatarEmoji: user.avatar_emoji, level: user.level, title: user.title }, stats: { current, longest, totalCheckins: all.results.length } }));
      }

      if (path === "/api/profile" && method === "PUT") {
        const user = await getUser(DB, req);
        if (!user) return cors(json({ error: "未登录" }, 401));
        const { nickname, avatarEmoji } = await req.json();
        if (nickname) await DB.prepare("UPDATE users SET nickname=?,updated_at=datetime('now') WHERE id=?").bind(nickname, user.id).run();
        if (avatarEmoji) await DB.prepare("UPDATE users SET avatar_emoji=?,updated_at=datetime('now') WHERE id=?").bind(avatarEmoji, user.id).run();
        const u = await DB.prepare("SELECT * FROM users WHERE id=?").bind(user.id).first();
        return cors(json({ user: { id: u.id, email: u.email, nickname: u.nickname, avatarEmoji: u.avatar_emoji, level: u.level, title: u.title } }));
      }

      // Health
      if (path === "/") return cors(json({ status: "ok", name: "jieluxia-api" }));

      return cors(json({ error: "Not found" }, 404));
    } catch (e) {
      return cors(json({ error: e.message }, 500));
    }
  },
};
