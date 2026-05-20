import { getDailyQuote } from "@/lib/quotes";
import { GlassCard } from "./ui/GlassCard";

export function QuoteCard({ activeCount }: { activeCount: number }) {
  const quote = getDailyQuote();

  return (
    <GlassCard strong className="p-5 flex flex-col justify-between">
      <div className="text-xs text-[rgba(180,210,255,0.6)] mb-3 font-medium tracking-wider uppercase">
        今日格言
      </div>
      <div>
        <div className="text-3xl mb-3">💡</div>
        <blockquote className="m-0 text-sm leading-relaxed text-[#b0d0ff] italic">
          &ldquo;{quote.text}&rdquo;
        </blockquote>
        <div className="mt-3 text-xs text-[rgba(180,210,255,0.4)]">
          — {quote.author}
        </div>
      </div>
      <div className="glass-pill px-3.5 py-2 inline-flex items-center gap-2 mt-4">
        <span className="text-xs text-[#7dd4ff]">
          🔥 社区今日 {activeCount.toLocaleString()} 人在坚守
        </span>
      </div>
    </GlassCard>
  );
}
