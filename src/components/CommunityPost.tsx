export function CommunityPost({
  avatar,
  name,
  days,
  content,
  time,
  likeCount,
  onLike,
  isAnonymous,
  isOwn,
  onDelete,
}: {
  avatar: string;
  name: string;
  days: number;
  content: string;
  time: string;
  likeCount: number;
  onLike?: () => void;
  isAnonymous?: boolean;
  isOwn?: boolean;
  onDelete?: () => void;
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
            background: isAnonymous ? "var(--color-chalk)" : "var(--color-obsidian)",
            flexShrink: 0,
            fontSize: "14px",
          }}
        >
          <span style={{ color: isAnonymous ? "var(--color-gravel)" : "var(--color-eggshell)" }}>{isAnonymous ? "👤" : avatar}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "14px", fontWeight: 500, color: isAnonymous ? "var(--color-gravel)" : "var(--color-obsidian)" }}>
                {isAnonymous ? "匿名" : name}
              </span>
              {!isAnonymous && days > 0 && <span className="pill">{days}天</span>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "12px", color: "var(--color-slate)", flexShrink: 0 }}>
                {time}
              </span>
              {isOwn && onDelete && (
                <button
                  onClick={onDelete}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: 2,
                    color: "var(--color-slate)",
                    display: "flex",
                    alignItems: "center",
                  }}
                  title="删除"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                </button>
              )}
            </div>
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
