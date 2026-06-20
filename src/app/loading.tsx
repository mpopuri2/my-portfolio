export default function Loading() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#04040a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        fontFamily: "monospace",
      }}
    >
      {/* Animated dots */}
      <style>{`
        @keyframes pulse-dot {
          0%, 80%, 100% { opacity: 0.15; transform: scale(0.8); }
          40%            { opacity: 1;    transform: scale(1.2); }
        }
        .ld { width:10px;height:10px;border-radius:50%;background:#818cf8;display:inline-block;animation:pulse-dot 1.2s ease-in-out infinite; }
        .ld:nth-child(2){animation-delay:0.15s}
        .ld:nth-child(3){animation-delay:0.3s}
      `}</style>

      <span style={{ fontSize: 13, letterSpacing: "0.25em", color: "#818cf8", textTransform: "uppercase" }}>
        Manjunath Popuri · Portfolio
      </span>
      <div style={{ display: "flex", gap: 8 }}>
        <span className="ld" />
        <span className="ld" />
        <span className="ld" />
      </div>
    </div>
  );
}
