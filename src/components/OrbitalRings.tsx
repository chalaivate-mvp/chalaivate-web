export default function OrbitalRings({
  size = 500,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`absolute pointer-events-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ring 1 */}
      <div
        className="absolute inset-0 rounded-full border border-blue-primary/20"
        style={{
          animation: "orbit 30s linear infinite",
        }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-primary shadow-lg shadow-blue-primary/50" />
      </div>

      {/* Ring 2 */}
      <div
        className="absolute rounded-full border border-amber-accent/15"
        style={{
          inset: "12%",
          animation: "orbit-reverse 25s linear infinite",
          transform: "rotateX(60deg)",
        }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-accent shadow-lg shadow-amber-accent/50" />
      </div>

      {/* Ring 3 */}
      <div
        className="absolute rounded-full border border-blue-light/10"
        style={{
          inset: "25%",
          animation: "orbit 45s linear infinite",
          transform: "rotateX(75deg) rotateY(20deg)",
        }}
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1 h-1 rounded-full bg-blue-light shadow-lg shadow-blue-light/50" />
      </div>
    </div>
  );
}
