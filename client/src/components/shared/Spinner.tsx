interface SpinnerProps {
  size?: number;
}

export function Spinner({ size = 48 }: SpinnerProps) {
  const stroke = Math.max(3, Math.round(size * 0.1));
  const dot = Math.max(6, Math.round(size * 0.16));

  return (
    <div
      className="relative animate-spin"
      style={{ width: size, height: size, animationDuration: "1.1s" }}
      role="status"
      aria-label="Loading"
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "conic-gradient(from 90deg, #1465e6 0deg, rgba(20, 101, 230, 0) 300deg)",
          WebkitMaskImage: `radial-gradient(farthest-side, transparent calc(100% - ${stroke}px), #000 calc(100% - ${stroke}px))`,
          maskImage: `radial-gradient(farthest-side, transparent calc(100% - ${stroke}px), #000 calc(100% - ${stroke}px))`,
        }}
      />
      <span
        className="absolute left-1/2 top-0 rounded-full bg-brand-900"
        style={{ width: dot, height: dot, transform: "translate(-50%, -50%)" }}
      />
    </div>
  );
}
