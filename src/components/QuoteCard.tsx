import { getDailyQuote } from "@/lib/quotes";

export function QuoteCard({ activeCount }: { activeCount: number }) {
  const quote = getDailyQuote();

  return (
    <div className="card p-5 flex flex-col justify-between">
      <div className="text-[11px] font-medium mb-3 uppercase" style={{ color: "var(--color-slate)", letterSpacing: "0.05em" }}>
        今日格言
      </div>
      <div>
        <blockquote className="m-0 text-[14px] leading-relaxed italic" style={{ color: "var(--color-gravel)" }}>
          &ldquo;{quote.text}&rdquo;
        </blockquote>
        <div className="mt-3 text-[11px]" style={{ color: "var(--color-slate)" }}>
          — {quote.author}
        </div>
      </div>
      <div className="mt-4 text-[12px]" style={{ color: "var(--color-gravel)" }}>
        社区今日 {activeCount.toLocaleString()} 人在坚守
      </div>
    </div>
  );
}
