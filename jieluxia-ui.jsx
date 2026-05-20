import { useState, useEffect } from "react";

const GLASS = {
  card: {
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "20px",
  },
  cardStrong: {
    background: "rgba(255,255,255,0.10)",
    backdropFilter: "blur(28px) saturate(200%)",
    WebkitBackdropFilter: "blur(28px) saturate(200%)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: "24px",
  },
  pill: {
    background: "rgba(100,180,255,0.15)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(100,180,255,0.3)",
    borderRadius: "100px",
  },
};

const BG_STYLE = {
  background: "radial-gradient(ellipse 80% 60% at 10% 20%, #0d2d4a 0%, #081828 50%, #050f1a 100%)",
  minHeight: "100vh",
  position: "relative",
  overflow: "hidden",
};

function GlowOrb({ x, y, color, size }) {
  return (
    <div style={{
      position: "absolute", left: x, top: y,
      width: size, height: size,
      background: color,
      borderRadius: "50%",
      filter: "blur(80px)",
      opacity: 0.35,
      pointerEvents: "none",
    }} />
  );
}

function StreakRing({ days, label }) {
  const r = 54, cx = 64, cy = 64;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(days / 90, 1);
  const dash = circ * pct;
  return (
    <div style={{ position: "relative", width: 128, height: 128 }}>
      <svg width="128" height="128" style={{ transform: "rotate(-90deg)" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
        <circle
          cx={cx} cy={cy} r={r} fill="none"
          stroke="url(#arcGrad)" strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4ab8ff" />
            <stop offset="100%" stopColor="#0066cc" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 28, fontWeight: 700, color: "#e0f0ff", letterSpacing: -1, lineHeight: 1 }}>{days}</span>
        <span style={{ fontSize: 11, color: "rgba(180,210,255,0.7)", marginTop: 2 }}>{label}</span>
      </div>
    </div>
  );
}

function MilestoneBar({ milestones, current }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 4 }}>
      {milestones.map((m, i) => {
        const done = current >= m.days;
        const active = !done && (i === 0 || current >= milestones[i - 1].days);
        return (
          <div key={i} style={{ flex: 1, textAlign: "center" }}>
            <div style={{
              height: 6, borderRadius: 4, marginBottom: 6,
              background: done ? "linear-gradient(90deg,#4ab8ff,#0066cc)" : active ? "rgba(74,184,255,0.35)" : "rgba(255,255,255,0.08)",
              transition: "background 0.5s",
            }} />
            <div style={{ fontSize: 10, color: done ? "#4ab8ff" : "rgba(180,210,255,0.4)" }}>{m.label}</div>
          </div>
        );
      })}
    </div>
  );
}

function WebDashboard({ streak }) {
  const [checkedIn, setCheckedIn] = useState(false);
  const milestones = [
    { days: 7, label: "7天" }, { days: 14, label: "2周" }, { days: 30, label: "1月" },
    { days: 60, label: "2月" }, { days: 90, label: "90天" },
  ];
  const weekData = [
    { d: "一", h: 65 }, { d: "二", h: 80 }, { d: "三", h: 55 }, { d: "四", h: 90 },
    { d: "五", h: 70 }, { d: "六", h: 85 }, { d: "日", h: 60 },
  ];
  const benefits = [
    { icon: "⚡", label: "精力提升", val: "+34%" },
    { icon: "🧠", label: "专注力", val: "+28%" },
    { icon: "💪", label: "自信心", val: "+41%" },
    { icon: "😴", label: "睡眠质量", val: "+22%" },
  ];

  return (
    <div style={{ ...BG_STYLE, fontFamily: "'SF Pro Display', 'PingFang SC', system-ui, sans-serif" }}>
      <GlowOrb x="-100px" y="-80px" color="#1a5fa0" size="500px" />
      <GlowOrb x="60%" y="40%" color="#0d3f6e" size="400px" />
      <GlowOrb x="80%" y="-50px" color="#1a3c6b" size="350px" />

      <div style={{ position: "relative", zIndex: 1, display: "flex", minHeight: "100vh" }}>
        {/* Sidebar */}
        <div style={{ width: 220, padding: "32px 16px", display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
          <div style={{ marginBottom: 24, paddingLeft: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#4ab8ff,#1a6cb4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🛡️</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#e0f0ff" }}>戒撸侠</div>
                <div style={{ fontSize: 11, color: "rgba(180,210,255,0.5)" }}>自律成就未来</div>
              </div>
            </div>
          </div>
          {[
            { icon: "📊", label: "仪表盘", active: true },
            { icon: "📅", label: "打卡记录" },
            { icon: "🏆", label: "成就勋章" },
            { icon: "💬", label: "社区交流" },
            { icon: "📖", label: "知识库" },
            { icon: "⚙️", label: "设置" },
          ].map((item) => (
            <div key={item.label} style={{
              padding: "10px 14px", borderRadius: 14, cursor: "pointer",
              ...(item.active ? GLASS.pill : {}),
              display: "flex", alignItems: "center", gap: 10,
              color: item.active ? "#b0d8ff" : "rgba(180,210,255,0.5)",
              fontSize: 14, transition: "all 0.2s",
            }}>
              <span>{item.icon}</span><span>{item.label}</span>
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ ...GLASS.card, padding: "14px 16px" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#4ab8ff,#1a6cb4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, marginBottom: 8 }}>👤</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#c0deff" }}>铁血战士</div>
            <div style={{ fontSize: 11, color: "rgba(180,210,255,0.5)", marginTop: 2 }}>Lv.7 · 坚守者</div>
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: "32px 28px 32px 12px", overflowY: "auto" }}>
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#e0f0ff", margin: 0, letterSpacing: -0.5 }}>欢迎回来，铁血战士 👋</h1>
            <p style={{ fontSize: 14, color: "rgba(180,210,255,0.55)", margin: "6px 0 0" }}>今天是你坚守的第 {streak} 天，继续保持！</p>
          </div>

          {/* Top Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
            {/* Streak Card */}
            <div style={{ ...GLASS.cardStrong, padding: "24px", gridColumn: "span 1", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle,rgba(74,184,255,0.15),transparent 70%)" }} />
              <div style={{ fontSize: 12, color: "rgba(180,210,255,0.6)", marginBottom: 16, fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase" }}>当前坚守</div>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <StreakRing days={streak} label="天" />
                <div>
                  <div style={{ fontSize: 13, color: "rgba(180,210,255,0.7)", marginBottom: 4 }}>连续打卡</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#4ab8ff" }}>第 {streak} 天</div>
                  <div style={{ fontSize: 12, color: "rgba(180,210,255,0.45)", marginTop: 6 }}>距下一里程碑</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#7dd4ff", marginTop: 2 }}>还需 {30 - (streak % 30)} 天</div>
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <MilestoneBar milestones={milestones} current={streak} />
              </div>
            </div>

            {/* Benefits */}
            <div style={{ ...GLASS.card, padding: "20px" }}>
              <div style={{ fontSize: 12, color: "rgba(180,210,255,0.6)", marginBottom: 14, fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase" }}>身心改善</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {benefits.map(b => (
                  <div key={b.label} style={{ ...GLASS.pill, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontSize: 18 }}>{b.icon}</span>
                    <span style={{ fontSize: 11, color: "rgba(180,210,255,0.6)" }}>{b.label}</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#4ab8ff" }}>{b.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Check-in */}
            <div style={{ ...GLASS.card, padding: "20px", display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 12, color: "rgba(180,210,255,0.6)", marginBottom: 14, fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase" }}>今日签到</div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                {checkedIn ? (
                  <>
                    <div style={{ fontSize: 44 }}>✅</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#4ab8ff" }}>今日已签到！</div>
                    <div style={{ fontSize: 12, color: "rgba(180,210,255,0.5)", textAlign: "center" }}>坚持就是胜利，明天继续加油</div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 44 }}>🛡️</div>
                    <div style={{ fontSize: 14, color: "rgba(180,210,255,0.6)", textAlign: "center" }}>记录今天的坚守</div>
                    <button onClick={() => setCheckedIn(true)} style={{
                      padding: "12px 32px", borderRadius: 14, border: "none", cursor: "pointer",
                      background: "linear-gradient(135deg,#4ab8ff,#1a6cb4)",
                      color: "#fff", fontWeight: 700, fontSize: 15, letterSpacing: 0.3,
                      boxShadow: "0 4px 20px rgba(74,184,255,0.3)", transition: "transform 0.15s",
                    }}>今日打卡 ✓</button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
            {/* Weekly Chart */}
            <div style={{ ...GLASS.card, padding: "20px" }}>
              <div style={{ fontSize: 12, color: "rgba(180,210,255,0.6)", marginBottom: 16, fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase" }}>本周自律指数</div>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-end", height: 100 }}>
                {weekData.map((w, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div style={{
                      width: "100%", height: `${w.h}%`,
                      background: i === 5 ? "linear-gradient(180deg,#4ab8ff,#1a6cb4)" : "rgba(74,184,255,0.2)",
                      borderRadius: "6px 6px 3px 3px",
                      border: i === 5 ? "none" : "1px solid rgba(74,184,255,0.2)",
                      transition: "height 0.5s",
                      minHeight: 12,
                    }} />
                    <span style={{ fontSize: 11, color: "rgba(180,210,255,0.5)" }}>{w.d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Motivational Quote */}
            <div style={{ ...GLASS.cardStrong, padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ fontSize: 12, color: "rgba(180,210,255,0.6)", marginBottom: 12, fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase" }}>今日格言</div>
              <div>
                <div style={{ fontSize: 32, marginBottom: 12 }}>💡</div>
                <blockquote style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "#b0d0ff", fontStyle: "italic" }}>
                  "自律是最高形式的自爱，是你能给予自己最好的礼物。"
                </blockquote>
                <div style={{ marginTop: 12, fontSize: 12, color: "rgba(180,210,255,0.4)" }}>— 每日智慧</div>
              </div>
              <div style={{ ...GLASS.pill, padding: "8px 14px", display: "inline-flex", alignItems: "center", gap: 8, marginTop: 16 }}>
                <span style={{ fontSize: 12, color: "#7dd4ff" }}>🔥 社区今日 2,847 人在坚守</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileApp({ streak }) {
  const [tab, setTab] = useState("home");
  const [checkedIn, setCheckedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const tabs = [
    { id: "home", icon: "🏠", label: "主页" },
    { id: "stats", icon: "📊", label: "数据" },
    { id: "community", icon: "👥", label: "社区" },
    { id: "me", icon: "👤", label: "我的" },
  ];

  const renderHome = () => (
    <div style={{ padding: "0 16px 100px", overflowY: "auto" }}>
      {/* Hero Streak */}
      <div style={{ ...GLASS.cardStrong, padding: "28px 20px 24px", marginBottom: 14, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle,rgba(74,184,255,0.18),transparent 70%)", pointerEvents: "none" }} />
        <div style={{ fontSize: 11, color: "rgba(180,210,255,0.55)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>连续坚守</div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <StreakRing days={streak} label="天" />
        </div>
        <div style={{ fontSize: 13, color: "rgba(180,210,255,0.6)", marginBottom: 8 }}>你已超越 <span style={{ color: "#4ab8ff", fontWeight: 700 }}>87%</span> 的战友</div>
        <button onClick={() => setShowModal(true)} style={{
          marginTop: 8, padding: "12px 40px", borderRadius: 14, border: "none",
          background: checkedIn ? "rgba(74,184,255,0.15)" : "linear-gradient(135deg,#4ab8ff,#1a6cb4)",
          color: checkedIn ? "#4ab8ff" : "#fff", fontWeight: 700, fontSize: 14,
          cursor: "pointer", width: "100%",
          border: checkedIn ? "1px solid rgba(74,184,255,0.4)" : "none",
        }}>
          {checkedIn ? "✅ 今日已打卡" : "今日打卡"}
        </button>
      </div>

      {/* Quick Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[
          { icon: "🔥", label: "最长记录", val: "42天" },
          { icon: "⚡", label: "精力值", val: "92分" },
          { icon: "🏆", label: "成就数", val: "7枚" },
          { icon: "👥", label: "社区排名", val: "#128" },
        ].map(s => (
          <div key={s.label} style={{ ...GLASS.card, padding: "14px 16px" }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 12, color: "rgba(180,210,255,0.5)" }}>{s.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#b0d8ff", marginTop: 2 }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Today's Mission */}
      <div style={{ ...GLASS.card, padding: "16px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, color: "rgba(180,210,255,0.55)", fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 12 }}>今日任务</div>
        {[
          { label: "冥想 10 分钟", done: true },
          { label: "运动 30 分钟", done: true },
          { label: "阅读 20 分钟", done: false },
          { label: "冷水澡", done: false },
        ].map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: t.done ? "linear-gradient(135deg,#4ab8ff,#1a6cb4)" : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0 }}>
              {t.done ? "✓" : ""}
            </div>
            <span style={{ fontSize: 14, color: t.done ? "rgba(180,210,255,0.5)" : "#c0deff", textDecoration: t.done ? "line-through" : "none" }}>{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStats = () => (
    <div style={{ padding: "0 16px 100px" }}>
      <div style={{ ...GLASS.card, padding: "18px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, color: "rgba(180,210,255,0.55)", fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 12 }}>月度日历</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6 }}>
          {["一","二","三","四","五","六","日"].map(d => (
            <div key={d} style={{ textAlign: "center", fontSize: 10, color: "rgba(180,210,255,0.4)", paddingBottom: 6 }}>{d}</div>
          ))}
          {Array.from({ length: 31 }, (_, i) => i + 1).map(d => {
            const success = d <= streak && d <= 20;
            const today = d === 20;
            return (
              <div key={d} style={{
                width: "100%", aspectRatio: "1", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: today ? 700 : 400,
                background: today ? "linear-gradient(135deg,#4ab8ff,#1a6cb4)" : success ? "rgba(74,184,255,0.2)" : "rgba(255,255,255,0.04)",
                color: today ? "#fff" : success ? "#4ab8ff" : "rgba(180,210,255,0.4)",
                border: today ? "none" : success ? "1px solid rgba(74,184,255,0.3)" : "1px solid rgba(255,255,255,0.05)",
              }}>{d}</div>
            );
          })}
        </div>
      </div>
      <div style={{ ...GLASS.card, padding: "18px" }}>
        <div style={{ fontSize: 12, color: "rgba(180,210,255,0.55)", fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 12 }}>身心数据</div>
        {[
          { label: "精力", val: 85, color: "#4ab8ff" },
          { label: "专注力", val: 72, color: "#7dd4ff" },
          { label: "情绪稳定", val: 90, color: "#4ab8ff" },
          { label: "睡眠质量", val: 68, color: "#b0d8ff" },
        ].map(s => (
          <div key={s.label} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 13, color: "#b0d8ff" }}>{s.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: s.color }}>{s.val}%</span>
            </div>
            <div style={{ height: 5, borderRadius: 4, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${s.val}%`, background: `linear-gradient(90deg,${s.color}80,${s.color})`, borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCommunity = () => (
    <div style={{ padding: "0 16px 100px" }}>
      {[
        { name: "钢铁意志", days: 127, msg: "突破了100天！感觉自己脱胎换骨", time: "2分钟前", avatar: "💪" },
        { name: "晨曦战士", days: 45, msg: "今天遇到了诱惑，但我挺过去了", time: "15分钟前", avatar: "🌅" },
        { name: "禅定之心", days: 88, msg: "冥想帮助了我很多，推荐大家试试", time: "1小时前", avatar: "🧘" },
        { name: "破晓勇士", days: 31, msg: "第一个月完成！感谢社区的支持", time: "3小时前", avatar: "🌄" },
      ].map((p, i) => (
        <div key={i} style={{ ...GLASS.card, padding: "14px 16px", marginBottom: 10 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,rgba(74,184,255,0.25),rgba(26,108,180,0.25))", border: "1px solid rgba(74,184,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{p.avatar}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#c0deff" }}>{p.name}</span>
                  <span style={{ marginLeft: 8, fontSize: 11, ...GLASS.pill, padding: "2px 8px", color: "#4ab8ff" }}>🔥 {p.days}天</span>
                </div>
                <span style={{ fontSize: 11, color: "rgba(180,210,255,0.35)" }}>{p.time}</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: "rgba(180,210,255,0.7)", lineHeight: 1.5 }}>{p.msg}</p>
              <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                <span style={{ fontSize: 12, color: "rgba(180,210,255,0.4)", cursor: "pointer" }}>👍 点赞</span>
                <span style={{ fontSize: 12, color: "rgba(180,210,255,0.4)", cursor: "pointer" }}>💬 回复</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderMe = () => (
    <div style={{ padding: "0 16px 100px" }}>
      <div style={{ ...GLASS.cardStrong, padding: "24px 20px", marginBottom: 14, textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#4ab8ff,#1a6cb4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 12px" }}>🛡️</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#e0f0ff" }}>铁血战士</div>
        <div style={{ fontSize: 13, color: "rgba(180,210,255,0.5)", marginTop: 4 }}>Lv.7 · 坚守者 · 加入 180 天</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 18 }}>
          {[{ val: streak, label: "当前天数" }, { val: 42, label: "最长记录" }, { val: 7, label: "成就枚数" }].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#4ab8ff" }}>{s.val}</div>
              <div style={{ fontSize: 11, color: "rgba(180,210,255,0.45)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ ...GLASS.card, padding: "6px 8px", marginBottom: 14 }}>
        {[
          { icon: "🏆", label: "我的成就" },
          { icon: "📖", label: "日记记录" },
          { icon: "🔔", label: "通知设置" },
          { icon: "🔒", label: "隐私保护" },
          { icon: "❓", label: "帮助与反馈" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 10px", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.05)" : "none", cursor: "pointer" }}>
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            <span style={{ flex: 1, fontSize: 14, color: "#c0deff" }}>{item.label}</span>
            <span style={{ fontSize: 16, color: "rgba(180,210,255,0.3)" }}>›</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ width: 375, height: 812, background: "radial-gradient(ellipse 100% 70% at 30% 10%, #0d2d4a,#081828 60%, #050f1a)", borderRadius: 44, overflow: "hidden", position: "relative", fontFamily: "'SF Pro Display','PingFang SC',system-ui,sans-serif", boxShadow: "0 30px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.12), inset 0 0 0 1px rgba(255,255,255,0.08)", display: "flex", flexDirection: "column" }}>
      <GlowOrb x="-60px" y="-60px" color="#1a5fa0" size="300px" />
      <GlowOrb x="50%" y="30%" color="#0d3f6e" size="250px" />

      {/* Status Bar */}
      <div style={{ padding: "14px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 10, flexShrink: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#c0deff" }}>9:41</span>
        <div style={{ width: 120, height: 28, background: "rgba(0,0,0,0.4)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 80, height: 12, background: "rgba(0,0,0,0.6)", borderRadius: 10 }} />
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#c0deff" }}>100%</span>
          <span style={{ fontSize: 14, color: "#c0deff" }}>🔋</span>
        </div>
      </div>

      {/* Page Header */}
      <div style={{ padding: "16px 20px 8px", flexShrink: 0, position: "relative", zIndex: 10 }}>
        {tab === "home" && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#e0f0ff", letterSpacing: -0.5 }}>今日坚守 🛡️</div>
              <div style={{ fontSize: 12, color: "rgba(180,210,255,0.5)", marginTop: 2 }}>每一天都是新的开始</div>
            </div>
            <div style={{ ...GLASS.pill, padding: "6px 12px", fontSize: 12, color: "#4ab8ff" }}>🔥 {streak}天</div>
          </div>
        )}
        {tab === "stats" && <div style={{ fontSize: 22, fontWeight: 700, color: "#e0f0ff" }}>数据统计 📊</div>}
        {tab === "community" && <div style={{ fontSize: 22, fontWeight: 700, color: "#e0f0ff" }}>战友社区 👥</div>}
        {tab === "me" && <div style={{ fontSize: 22, fontWeight: 700, color: "#e0f0ff" }}>个人中心 👤</div>}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", position: "relative", zIndex: 5 }}>
        {tab === "home" && renderHome()}
        {tab === "stats" && renderStats()}
        {tab === "community" && renderCommunity()}
        {tab === "me" && renderMe()}
      </div>

      {/* Bottom Nav */}
      <div style={{ ...GLASS.card, margin: "0 12px 20px", borderRadius: 24, padding: "10px 8px", display: "flex", justifyContent: "space-around", flexShrink: 0, position: "relative", zIndex: 10 }}>
        {tabs.map(t => (
          <div key={t.id} onClick={() => setTab(t.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", padding: "4px 12px", borderRadius: 14, background: tab === t.id ? "rgba(74,184,255,0.15)" : "transparent", transition: "all 0.2s" }}>
            <span style={{ fontSize: 20 }}>{t.icon}</span>
            <span style={{ fontSize: 10, color: tab === t.id ? "#4ab8ff" : "rgba(180,210,255,0.4)", fontWeight: tab === t.id ? 600 : 400 }}>{t.label}</span>
          </div>
        ))}
      </div>

      {/* Check-in Modal */}
      {showModal && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(5,15,26,0.7)", backdropFilter: "blur(12px)", display: "flex", alignItems: "flex-end", zIndex: 100 }}>
          <div style={{ ...GLASS.cardStrong, width: "100%", borderRadius: "28px 28px 0 0", padding: "28px 24px 40px" }}>
            <div style={{ width: 36, height: 4, background: "rgba(255,255,255,0.2)", borderRadius: 4, margin: "0 auto 24px" }} />
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#e0f0ff" }}>今日打卡确认</div>
              <div style={{ fontSize: 14, color: "rgba(180,210,255,0.55)", marginTop: 6 }}>恭喜你完成今天的坚守！</div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: "14px", borderRadius: 16, border: "1px solid rgba(74,184,255,0.3)", background: "rgba(74,184,255,0.1)", color: "#7dd4ff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>取消</button>
              <button onClick={() => { setCheckedIn(true); setShowModal(false); }} style={{ flex: 2, padding: "14px", borderRadius: 16, border: "none", background: "linear-gradient(135deg,#4ab8ff,#1a6cb4)", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 20px rgba(74,184,255,0.35)" }}>确认打卡 ✓</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("both");
  const streak = 23;

  return (
    <div style={{ minHeight: "100vh", background: "#030c14", fontFamily: "'SF Pro Display','PingFang SC',system-ui,sans-serif" }}>
      {/* View Toggle */}
      <div style={{ padding: "20px 28px 0", display: "flex", alignItems: "center", gap: 12, position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, background: "rgba(3,12,20,0.8)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#4ab8ff,#1a6cb4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🛡️</div>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#e0f0ff" }}>戒撸侠</span>
        </div>
        {[
          { id: "web", label: "💻 网页端" },
          { id: "mobile", label: "📱 App端" },
          { id: "both", label: "🖥 双端预览" },
        ].map(v => (
          <button key={v.id} onClick={() => setView(v.id)} style={{
            padding: "7px 18px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, transition: "all 0.2s",
            background: view === v.id ? "linear-gradient(135deg,rgba(74,184,255,0.25),rgba(26,108,180,0.25))" : "rgba(255,255,255,0.05)",
            color: view === v.id ? "#4ab8ff" : "rgba(180,210,255,0.5)",
            boxShadow: view === v.id ? "inset 0 0 0 1px rgba(74,184,255,0.35)" : "inset 0 0 0 1px rgba(255,255,255,0.06)",
          }}>{v.label}</button>
        ))}
      </div>

      <div style={{ paddingTop: 64 }}>
        {view === "web" && <WebDashboard streak={streak} />}
        {view === "mobile" && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 64px)", padding: 40 }}>
            <MobileApp streak={streak} />
          </div>
        )}
        {view === "both" && (
          <div style={{ display: "flex", gap: 0, minHeight: "calc(100vh - 64px)" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <WebDashboard streak={streak} />
            </div>
            <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 60px", background: "rgba(0,0,0,0.3)", borderLeft: "1px solid rgba(255,255,255,0.05)" }}>
              <MobileApp streak={streak} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
