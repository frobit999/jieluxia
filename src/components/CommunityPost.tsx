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
    <div className="glass-card p-4 mb-2.5">
      <div className="flex gap-3 items-start">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, rgba(77,201,246,0.2), rgba(255,110,180,0.2))",
            border: "1px solid rgba(77, 201, 246, 0.25)",
          }}
        >
          {avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[rgba(200,220,255,0.85)]">
                {name}
              </span>
              <span className="glass-pill px-2 py-0.5 text-[11px] text-[#ff6eb4]">
                🔥 {days}天
              </span>
            </div>
            <span className="text-[11px] text-[rgba(200,220,255,0.35)] flex-shrink-0 ml-2">
              {time}
            </span>
          </div>
          <p className="m-0 text-[13px] text-[rgba(200,220,255,0.7)] leading-relaxed">
            {content}
          </p>
          <div className="flex gap-4 mt-2">
            <button
              onClick={onLike}
              className="text-xs text-[rgba(200,220,255,0.4)] cursor-pointer bg-transparent border-none hover:text-[#ff6eb4] transition-colors"
            >
              👍 {likeCount > 0 ? likeCount : "点赞"}
            </button>
            <span className="text-xs text-[rgba(200,220,255,0.4)]">
              💬 回复
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
