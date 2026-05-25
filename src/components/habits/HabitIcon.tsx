"use client";

export default function HabitIcon({ icon, size = 32 }: { icon: string; size?: number }) {
  if (icon.trimStart().startsWith("<svg")) {
    const sanitized = icon
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, "")
      .replace(/width="\d+"/, `width="${size}"`)
      .replace(/height="\d+"/, `height="${size}"`);
    return (
      <span
        style={{ display: "inline-flex", width: size, height: size, color: "var(--color-obsidian)" }}
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    );
  }
  return <span style={{ fontSize: size * 0.75 }}>{icon}</span>;
}
