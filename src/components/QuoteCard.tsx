import { getDailyQuote } from "@/lib/quotes";

export function QuoteCard({ activeCount }: { activeCount: number }) {
  const quote = getDailyQuote();

  return (
    <div className="card" style={{ padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
      <div>
        <blockquote
          style={{
            margin: "0 0 16px",
            fontSize: "16px",
            lineHeight: 1.6,
            fontStyle: "italic",
            color: "var(--color-gravel)",
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 400,
          }}
        >
          &ldquo;{quote.text}&rdquo;
        </blockquote>
        <p style={{ margin: 0, fontSize: "13px", color: "var(--color-slate)" }}>
          — {quote.author}
        </p>
      </div>
      <p style={{ margin: "24px 0 0", fontSize: "13px", color: "var(--color-gravel)", borderTop: "1px solid var(--color-chalk)", paddingTop: "16px" }}>
        社区今日 {activeCount.toLocaleString()} 人在坚守
      </p>
    </div>
  );
}
