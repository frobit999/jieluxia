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
    <div className="card p-4 mb-2.5">
      <div className="flex gap-3 items-start">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0"
          style={{
            background: "var(--color-obsidian)",
          }}
        >
          <span style={{ color: "var(--color-eggshell)" }}>{avatar}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-medium" style={{ color: "var(--color-obsidian)" }}>
                {name}
              </span>
              <span className="pill">
                {days}天
              </span>
            </div>
            <span className="text-[11px] flex-shrink-0 ml-2" style={{ color: "var(--color-slate)" }}>
              {time}
            </span>
          </div>
          <p className="m-0 text-[13px] leading-relaxed" style={{ color: "var(--color-gravel)" }}>
            {content}
          </p>
          <div className="flex gap-4 mt-2">
            <button
              onClick={onLike}
              className="text-[12px] cursor-pointer bg-transparent border-none transition-colors"
              style={{ color: "var(--color-slate)" }}
            >
              {likeCount > 0 ? `${likeCount} 赞` : "赞"}
            </button>
            <span className="text-[12px]" style={{ color: "var(--color-slate)" }}>
              回复
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
