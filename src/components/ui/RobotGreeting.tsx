"use client";

import { useEffect, useRef, useState } from "react";

const BG   = "#04040a";
const eio  = (t: number) => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
const eOut = (t: number) => 1 - Math.pow(1 - t, 3);

export default function RobotGreeting() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const canvas  = canvasRef.current;
    const overlay = overlayRef.current;
    if (!canvas || !overlay) return;

    const DPR = window.devicePixelRatio || 1;
    const W   = window.innerWidth;
    const H   = window.innerHeight;

    // Single canvas — retina-sharp
    canvas.width        = W * DPR;
    canvas.height       = H * DPR;
    canvas.style.width  = `${W}px`;
    canvas.style.height = `${H}px`;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(DPR, DPR);

    const cx   = W / 2;
    const cy   = H / 2;
    const manX = W - 80;
    const manY = H - 80;

    // Responsive font sizes
    const ns = Math.max(40, Math.min(80, W / 13)); // name
    const gs = Math.max(12, ns * 0.19);            // greeting
    const rs = Math.max(15, ns * 0.30);            // role
    const cs = Math.max(12, ns * 0.20);            // company

    const lineDefs = [
      { text: "Hello, I'm",          font: `600 ${gs}px Inter,sans-serif`, y: cy - 96 },
      { text: "Manjunath Popuri",    font: `200 ${ns}px Inter,sans-serif`, y: cy - 28 },
      { text: "AI  ·  ML Engineer", font: `700 ${rs}px Inter,sans-serif`, y: cy + 42 },
      { text: "Stripe",             font: `700 ${cs}px Inter,sans-serif`, y: cy + 80 },
    ];

    type LM = {
      text: string; font: string; y: number;
      left: number; right: number; ascent: number; descent: number;
    };

    const LMs: LM[] = lineDefs.map(l => {
      ctx.font = l.font; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      const m = ctx.measureText(l.text);
      return {
        text: l.text, font: l.font, y: l.y,
        left:    cx - m.width / 2,
        right:   cx + m.width / 2,
        ascent:  m.actualBoundingBoxAscent  ?? ns * 0.75,
        descent: m.actualBoundingBoxDescent ?? ns * 0.25,
      };
    });

    // Cache one gradient per line (created once, reused every frame)
    const grads = LMs.map(lm => {
      const g = ctx.createLinearGradient(lm.left, 0, lm.right, 0);
      g.addColorStop(0,    "#818cf8"); // indigo
      g.addColorStop(0.50, "#38bdf8"); // sky
      g.addColorStop(1,    "#a78bfa"); // violet
      return g;
    });

    // Draw text up to revX on lineIdx; all previous lines fully drawn
    function drawText(linesDone: number, curLineIdx: number, curX: number, alpha = 1) {
      if (alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha    = alpha;
      ctx.textAlign      = "center";
      ctx.textBaseline   = "middle";

      LMs.forEach((lm, i) => {
        const clipRight = i < linesDone ? lm.right + 4 : i === curLineIdx ? curX : -1;
        if (clipRight <= lm.left) return;
        const pad = 12;
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, lm.y - lm.ascent - pad, clipRight, lm.ascent + lm.descent + pad * 2);
        ctx.clip();
        ctx.font      = lm.font;
        ctx.fillStyle = grads[i];
        ctx.fillText(lm.text, cx, lm.y);
        ctx.restore();
      });

      ctx.restore();
    }

    /* ── Segments ────────────────────────────────────────── */
    type Seg = {
      x0: number; y0: number; x1: number; y1: number;
      dur: number; isJump: boolean; lineIdx: number;
    };
    const segs: Seg[] = [];
    LMs.forEach((lm, i) => {
      if (i > 0) {
        const p = LMs[i - 1];
        segs.push({ x0:p.right, y0:p.y, x1:lm.left, y1:lm.y, dur:210, isJump:true, lineIdx:i });
      }
      const dur = Math.max(600, (lm.right - lm.left) / (W * 0.5) * 1900);
      segs.push({ x0:lm.left, y0:lm.y, x1:lm.right, y1:lm.y, dur, isJump:false, lineIdx:i });
    });
    const totalDur = segs.reduce((s, g) => s + g.dur, 0);

    /* ── Post-trace bezier to Manny ──────────────────────── */
    const jS  = { x: LMs[LMs.length - 1].right, y: LMs[LMs.length - 1].y };
    const jCx = jS.x + (manX - jS.x) * 0.25;
    const jCy = Math.min(jS.y, manY) - 200;
    const jBez = (t: number) => {
      const mt = 1 - t;
      return {
        x: mt*mt*jS.x + 2*mt*t*jCx + t*t*manX,
        y: mt*mt*jS.y + 2*mt*t*jCy + t*t*manY,
      };
    };

    /* ── Trail ───────────────────────────────────────────── */
    const TRAIL_LEN = 48;
    const trail: { x: number; y: number }[] = [];

    const COLOR_STOPS = [
      { r:129, g:140, b:248 }, // indigo
      { r: 56, g:189, b:248 }, // sky
      { r:167, g:139, b:250 }, // violet
    ];

    function trailColor(t: number) {
      const si = Math.min(Math.floor(t * (COLOR_STOPS.length - 1)), COLOR_STOPS.length - 2);
      const f  = t * (COLOR_STOPS.length - 1) - si;
      const ca = COLOR_STOPS[si], cb = COLOR_STOPS[si + 1];
      return {
        r: Math.round(ca.r + (cb.r - ca.r) * f),
        g: Math.round(ca.g + (cb.g - ca.g) * f),
        b: Math.round(ca.b + (cb.b - ca.b) * f),
      };
    }

    function drawTrail() {
      if (trail.length < 2) return;
      for (let i = 1; i < trail.length; i++) {
        const p = trail[i - 1], c = trail[i];
        if (Math.hypot(c.x - p.x, c.y - p.y) > 90) continue;
        const t     = i / trail.length;
        const col   = trailColor(t);
        const alpha = t * 0.80;
        ctx.shadowColor = `rgba(${col.r},${col.g},${col.b},${alpha * 0.6})`;
        ctx.shadowBlur  = 8 * t;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(c.x, c.y);
        ctx.strokeStyle = `rgba(${col.r},${col.g},${col.b},${alpha})`;
        ctx.lineWidth   = t * 3.5 + 0.4;
        ctx.lineCap     = "round";
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
    }

    function drawCursor(x: number, y: number, a = 1) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, 22);
      g.addColorStop(0,   `rgba(129,140,248,${0.45 * a})`);
      g.addColorStop(0.4, `rgba(56,189,248,${0.18 * a})`);
      g.addColorStop(1,   "rgba(56,189,248,0)");
      ctx.beginPath(); ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
      ctx.shadowColor = `rgba(167,139,250,${0.9 * a})`;
      ctx.shadowBlur  = 10;
      ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle   = `rgba(220,224,255,${a})`; ctx.fill();
      ctx.shadowBlur  = 0;
    }

    /* ── Animation loop ──────────────────────────────────── */
    type Phase = "trace" | "hold" | "journey" | "arrive";
    let phase: Phase = "trace";
    let t0 = Date.now(), holdT = 0, journeyT = 0, arriveT = 0;
    let fadeStarted = false;
    let raf = 0;

    const draw = () => {
      const now = Date.now();
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, W, H);

      if (phase === "trace") {
        const elapsed = Math.min(now - t0, totalDur);
        let remaining = elapsed;
        let curX = LMs[0].left, curY = LMs[0].y;
        let linesDone = 0, curLineIdx = 0, revX = LMs[0].left;

        for (let si = 0; si < segs.length; si++) {
          const seg = segs[si];
          if (remaining <= seg.dur) {
            const ep = seg.isJump
              ? eOut(Math.min(1, remaining / seg.dur))
              : eio(Math.min(1, remaining / seg.dur));
            curX = seg.x0 + (seg.x1 - seg.x0) * ep;
            curY = seg.y0 + (seg.y1 - seg.y0) * ep;
            if (seg.isJump) {
              linesDone  = seg.lineIdx;
              curLineIdx = seg.lineIdx;
              revX       = 0;
            } else {
              linesDone  = seg.lineIdx;
              curLineIdx = seg.lineIdx;
              revX       = curX;
            }
            break;
          }
          remaining -= seg.dur;
          if (!seg.isJump) { linesDone = seg.lineIdx + 1; }
        }

        drawText(linesDone, curLineIdx, revX);
        trail.push({ x: curX, y: curY });
        if (trail.length > TRAIL_LEN) trail.shift();
        drawTrail();
        drawCursor(curX, curY);
        if (elapsed >= totalDur) { phase = "hold"; holdT = now; trail.length = 0; }

      } else if (phase === "hold") {
        drawText(LMs.length, 0, 0);
        drawCursor(jS.x, jS.y, 0.35);
        if (now - holdT > 820) { phase = "journey"; journeyT = now; }

      } else if (phase === "journey") {
        const t   = Math.min(1, (now - journeyT) / 1350);
        const cur = jBez(eio(t));
        drawText(LMs.length, 0, 0, Math.max(0, 0.95 - t * 0.95));
        trail.push({ x: cur.x, y: cur.y });
        if (trail.length > TRAIL_LEN) trail.shift();
        drawTrail();
        drawCursor(cur.x, cur.y);
        if (t >= 1) { phase = "arrive"; arriveT = now; trail.length = 0; }

      } else if (phase === "arrive") {
        const t = Math.min(1, (now - arriveT) / 540);
        const a = Math.max(0, 1 - t * 1.9);
        if (a > 0) drawCursor(manX, manY, a);
        [0, 0.22].forEach(delay => {
          const rt = Math.max(0, Math.min(1, (t - delay) / (0.78 - delay)));
          if (rt <= 0) return;
          ctx.beginPath(); ctx.arc(manX, manY, rt * 34, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(129,140,248,${(1 - rt) * 0.65})`;
          ctx.lineWidth = 1.5; ctx.stroke();
        });
        if (!fadeStarted && t > 0.4) {
          fadeStarted = true;
          overlay.style.transition = "opacity 800ms ease-in";
          overlay.style.opacity    = "0";
          canvas.style.transition  = "opacity 960ms ease-in";
          canvas.style.opacity     = "0";
          setTimeout(() => setDone(true), 1060);
        }
        // Stop RAF once fully faded
        if (t >= 1) { cancelAnimationFrame(raf); return; }
      }

      raf = requestAnimationFrame(draw);
    };

    const tid = setTimeout(() => { raf = requestAnimationFrame(draw); }, 60);
    return () => { clearTimeout(tid); cancelAnimationFrame(raf); };
  }, []);

  if (done) return null;

  return (
    <>
      <div ref={overlayRef} style={{ position:"fixed",inset:0,zIndex:9999,background:BG,pointerEvents:"none" }}/>
      <canvas ref={canvasRef} style={{ position:"fixed",inset:0,zIndex:10000,pointerEvents:"none" }}/>
    </>
  );
}
