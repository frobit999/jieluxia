export function CommunityPost({
  avatar,
  name,
  days,
  content,
  time,
  likeCount,
  onLike,
}: {
  avatar: string;
  name: string;
  days: number;
  content: string;
  time: string;
  likeCount: number;
  onLike?: () => void;
}) {
  return (
    <div className="card" style={{ padding: "20px 24px" }}>
      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--color-obsidian)",
            flexShrink: 0,
            fontSize: "14px",
          }}
        >
          <span style={{ color: "var(--color-eggshell)" }}>{avatar}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--color-obsidian)" }}>
                {name}
              </span>
              {days > 0 && <span className="pill">{days}天</span>}
            </div>
            <span style={{ fontSize: "12px", color: "var(--color-slate)", flexShrink: 0 }}>
              {time}
            </span>
          </div>
          <p style={{ margin: "0 0 12px", fontSize: "14px", lineHeight: 1.5, color: "var(--color-gravel)" }}>
            {content}
          </p>
          <div style={{ display: "flex", gap: "20px" }}>
            <button
              onClick={onLike}
              style={{
                fontSize: "12px",
                cursor: "pointer",
                background: "transparent",
                border: "none",
                color: "var(--color-slate)",
                padding: 0,
                letterSpacing: "0.01em",
              }}
            >
              {likeCount > 0 ? `${likeCount} 赞` : "赞"}
            </button>
            <span style={{ fontSize: "12px", color: "var(--color-slate)" }}>
              回复
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
