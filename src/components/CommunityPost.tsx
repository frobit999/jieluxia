import { Heart, MessageCircle, Trash2 } from "lucide-react";
import { AppIcon } from "@/components/AppIcon";

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
          }}
        >
          <span style={{ color: isAnonymous ? "var(--color-gravel)" : "var(--color-eggshell)", display: "flex" }}>
            <AppIcon name={isAnonymous ? "user" : avatar} size={16} />
          </span>
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
                  <Trash2 size={14} strokeWidth={1.8} />
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
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Heart size={14} strokeWidth={1.8} />
              {likeCount > 0 ? `${likeCount} 赞` : "赞"}
            </button>
            <span style={{ fontSize: "12px", color: "var(--color-slate)", display: "inline-flex", alignItems: "center", gap: 5 }}>
              <MessageCircle size={14} strokeWidth={1.8} />
              回复
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
