export function GlowOrb({
  x,
  y,
  color,
  size,
}: {
  x: string;
  y: string;
  color: string;
  size: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        background: color,
        borderRadius: "50%",
        filter: "blur(80px)",
        opacity: 0.35,
        pointerEvents: "none",
      }}
    />
  );
}
