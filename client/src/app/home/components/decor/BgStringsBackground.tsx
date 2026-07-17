export default function BgStringsBackground() {
  return (
    <div
      aria-hidden="true"
      className="animate-bg-strings pointer-events-none absolute inset-0 opacity-60"
      style={{
        backgroundImage: "url('/landing/bg-strings.svg')",
        backgroundRepeat: "repeat",
        backgroundSize: "6337px 469px",
      }}
    />
  );
}
