"use client";
import { useRef, useCallback, useEffect, useState } from "react";

interface Props { value: number; max: number; unit: string; onChange: (v: number) => void; hasNote?: boolean; onNoteClick?: () => void; }

function computeStep(max: number) {
  if (max <= 20) return { step: 1, majorEvery: 5, tickWidth: 20 };
  if (max <= 60) return { step: 1, majorEvery: 5, tickWidth: 12 };
  if (max <= 150) return { step: 1, majorEvery: 5, tickWidth: 10 };
  if (max <= 300) return { step: 5, majorEvery: 5, tickWidth: 10 };
  return { step: 10, majorEvery: 5, tickWidth: 10 };
}

export default function DialPicker({ value, max, unit, onChange, hasNote, onNoteClick }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const lastValueRef = useRef(value);
  const [padding, setPadding] = useState(0);
  const { step, majorEvery, tickWidth } = computeStep(max);
  const majorInterval = step * majorEvery;
  const tickCount = Math.floor(max / step) + 1;
  const ticks: number[] = [];
  for (let i = 0; i < tickCount; i++) ticks.push(i * step);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    setPadding(el.clientWidth / 2 - tickWidth / 2);
    requestAnimationFrame(() => { el.scrollLeft = (value / step) * tickWidth; });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isScrollingRef.current) return;
    const el = scrollRef.current;
    if (el) el.scrollLeft = (value / step) * tickWidth;
  }, [value, step, tickWidth]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    isScrollingRef.current = true;
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => { isScrollingRef.current = false; }, 150);
    const index = Math.round(el.scrollLeft / tickWidth);
    const newValue = Math.min(max, Math.max(0, index * step));
    if (newValue !== lastValueRef.current) { lastValueRef.current = newValue; onChange(newValue); }
  }, [tickWidth, step, max, onChange]);

  useEffect(() => () => { if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current); }, []);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
        {onNoteClick && (
          <button onClick={(e) => { e.stopPropagation(); onNoteClick(); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={hasNote ? "var(--color-obsidian)" : "var(--color-chalk)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </button>
        )}
        <div style={{ textAlign: "center" }}>
          <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 48, fontWeight: 300, letterSpacing: "-0.96px", color: "var(--color-obsidian)" }}>{value}</span>
          <span style={{ fontSize: 16, color: "var(--color-gravel)", marginLeft: 4 }}>{unit}</span>
        </div>
      </div>
      <div style={{ position: "relative", height: 56, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "50%", top: 0, width: 1.5, height: 36, background: "var(--color-obsidian)", transform: "translateX(-50%)", zIndex: 2 }} />
        <div ref={scrollRef} onScroll={handleScroll} style={{ overflowX: "auto", overflowY: "hidden", height: "100%", scrollbarWidth: "none" }}>
          <div style={{ display: "flex", alignItems: "flex-end", height: "100%", paddingLeft: padding, paddingRight: padding }}>
            {ticks.map((tickVal, i) => {
              const isMajor = tickVal % majorInterval === 0;
              return (
                <div key={i} style={{ width: tickWidth, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
                  <div style={{ width: 1, height: isMajor ? 20 : 10, background: tickVal === value ? "var(--color-obsidian)" : "var(--color-chalk)" }} />
                  {isMajor && <div style={{ fontSize: 10, color: tickVal === value ? "var(--color-obsidian)" : "var(--color-gravel)", marginTop: 4, fontWeight: tickVal === value ? 500 : 400 }}>{tickVal}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
