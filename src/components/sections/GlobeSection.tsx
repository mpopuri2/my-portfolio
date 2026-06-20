"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// rotY sequence: 0.20 (Hyderabad) → 1.31 (Africa/Europe) → 2.86 (New York)
// rotY += each frame → globe rotates to reveal India → Africa/Europe → New York

const STOPS = [
  { id: "guntur",  label: "Guntur, India",   sub: "B.Tech 2019-2023", lat: 16.3067, lng: 80.4365, color: "#a78bfa" },
  { id: "hyd",     label: "Hyderabad",        sub: "Cognizant 2021-23",lat: 17.3850, lng: 78.4867, color: "#818cf8" },
  { id: "newyork", label: "New York, USA",    sub: "Stripe 2025-now",  lat: 40.7128, lng: -74.006, color: "#34d399" },
];

const ARCS = [
  { from: 0, to: 1 },
  { from: 1, to: 2 },
];

function project(lat: number, lng: number, cx: number, cy: number, R: number, rotY: number) {
  const phi   = (lat  * Math.PI) / 180;
  const theta = (lng  * Math.PI) / 180 + rotY;
  // sin/cos correct order: east goes RIGHT, west goes LEFT
  const x =  R * Math.cos(phi) * Math.sin(theta);
  const y =  R * Math.sin(phi);
  const z =  R * Math.cos(phi) * Math.cos(theta);
  return { sx: cx + x, sy: cy - y, z };
}

// Arc interpolates westward: Hyderabad (lng ~78°E) → New York (lng ~-74°W)
// Linear lng interpolation passes through 0°E (Africa/Europe) — correct westward route
function arcPoints(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
  cx: number, cy: number, R: number, rotY: number,
  steps = 80
) {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t   = i / steps;
    const lat = lat1 + (lat2 - lat1) * t;
    const lng = lng1 + (lng2 - lng1) * t;   // goes 78° → 0° → -74° (westward via Europe)
    const lift = Math.sin(Math.PI * t) * 0.30 * R;
    return { ...project(lat, lng, cx, cy, R + lift, rotY), t };
  });
}

function drawPlane(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  angle: number,
  color: string
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Outer glow
  ctx.shadowColor = "#ffffff";
  ctx.shadowBlur = 14;

  // Main body — bright white triangle pointing right
  ctx.beginPath();
  ctx.moveTo(14,  0);       // nose
  ctx.lineTo(-7, -6);       // left wing tip
  ctx.lineTo(-4,  0);       // tail notch
  ctx.lineTo(-7,  6);       // right wing tip
  ctx.closePath();
  ctx.fillStyle = "#ffffff";
  ctx.fill();

  // Colored accent stripe
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.moveTo(6, 0);
  ctx.lineTo(-4, -3.5);
  ctx.lineTo(-4,  3.5);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();

  ctx.restore();
}

export default function GlobeSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Start at 0.20 = Hyderabad centered; += per frame shows India→Africa→USA
  const rotY      = useRef(-1.370);
  const dragging  = useRef(false);
  const lastX     = useRef(0);
  const rafRef    = useRef<number>(0);
  const arcProg   = useRef(0);
  const geoRef    = useRef<[number, number][][] | null>(null);
  const [loaded,  setLoaded] = useState(false);

  // Fetch world-atlas TopoJSON
  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then((r) => r.json())
      .then((topo) => {
        const rawArcs: number[][][] = topo.arcs;
        const sx = topo.transform.scale[0],    sy = topo.transform.scale[1];
        const tx = topo.transform.translate[0], ty = topo.transform.translate[1];

        const decoded: [number, number][][] = rawArcs.map((arc) => {
          let px = 0, py = 0;
          return arc.map(([dx, dy]) => {
            px += dx; py += dy;
            return [px * sx + tx, py * sy + ty] as [number, number];
          });
        });

        const rings: [number, number][][] = [];
        function walk(a: unknown): void {
          if (typeof a === "number") {
            const idx = a < 0 ? ~a : a;
            const ring = decoded[idx];
            if (ring) rings.push(a < 0 ? ([...ring].reverse() as [number, number][]) : ring);
          } else if (Array.isArray(a)) {
            (a as unknown[]).forEach(walk);
          }
        }
        for (const g of topo.objects.countries.geometries) walk(g.arcs);
        geoRef.current = rings;
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const R  = Math.min(W, H) * 0.38;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Auto-rotate: += shows India → Africa/Europe → USA (westward route)
      if (!dragging.current) rotY.current += 0.003;

      arcProg.current = Math.min(1, arcProg.current + 0.006);

      // --- Sphere base ---
      const sg = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.3, 0, cx, cy, R);
      sg.addColorStop(0,   "rgba(30,27,75,0.88)");
      sg.addColorStop(0.5, "rgba(15,23,42,0.82)");
      sg.addColorStop(1,   "rgba(4,4,10,0.88)");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = sg;
      ctx.fill();

      // Clip to sphere
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();

      // Country outlines
      if (geoRef.current) {
        ctx.strokeStyle = "rgba(99,102,241,0.22)";
        ctx.lineWidth = 0.55;
        for (const ring of geoRef.current) {
          if (ring.length < 2) continue;
          ctx.beginPath();
          let pen = false;
          for (const [lng, lat] of ring) {
            const p = project(lat, lng, cx, cy, R, rotY.current);
            if (p.z < 0) { pen = false; continue; }
            pen ? ctx.lineTo(p.sx, p.sy) : ctx.moveTo(p.sx, p.sy);
            pen = true;
          }
          ctx.stroke();
        }
      }

      // Grid lines
      ctx.strokeStyle = "rgba(100,116,139,0.09)";
      ctx.lineWidth = 0.5;
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath(); let f = true;
        for (let lng = -180; lng <= 180; lng += 3) {
          const p = project(lat, lng, cx, cy, R, rotY.current);
          if (p.z < 0) { f = true; continue; }
          f ? ctx.moveTo(p.sx, p.sy) : ctx.lineTo(p.sx, p.sy); f = false;
        }
        ctx.stroke();
      }
      for (let lng = -180; lng < 180; lng += 30) {
        ctx.beginPath(); let f = true;
        for (let lat = -80; lat <= 80; lat += 3) {
          const p = project(lat, lng, cx, cy, R, rotY.current);
          if (p.z < 0) { f = true; continue; }
          f ? ctx.moveTo(p.sx, p.sy) : ctx.lineTo(p.sx, p.sy); f = false;
        }
        ctx.stroke();
      }

      ctx.restore();

      // Atmosphere
      const atmo = ctx.createRadialGradient(cx, cy, R * 0.93, cx, cy, R * 1.09);
      atmo.addColorStop(0, "rgba(99,102,241,0.16)");
      atmo.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.09, 0, Math.PI * 2);
      ctx.fillStyle = atmo;
      ctx.fill();

      // Globe border
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(99,102,241,0.3)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // --- Arcs + ✈ synced to globe rotation ---
      const TAU = 2 * Math.PI;
      ARCS.forEach(({ from, to }, arcIdx) => {
        const a = STOPS[from], b = STOPS[to];
        const segProg = Math.max(0, Math.min(1, (arcProg.current - arcIdx * 0.38) / 0.52));
        if (segProg <= 0) return;

        const pts = arcPoints(a.lat, a.lng, b.lat, b.lng, cx, cy, R, rotY.current, 80);
        const trailN = segProg >= 1 ? pts.length : Math.floor(pts.length * segProg);

        // Glow trail
        ctx.beginPath();
        let started = false;
        for (let i = 0; i < trailN; i++) {
          const { sx, sy, z } = pts[i];
          if (z < -R * 0.05) { started = false; continue; }
          started ? ctx.lineTo(sx, sy) : ctx.moveTo(sx, sy);
          started = true;
        }
        ctx.strokeStyle = b.color + "30";
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.stroke();

        // Bright core
        ctx.beginPath();
        started = false;
        for (let i = 0; i < trailN; i++) {
          const { sx, sy, z } = pts[i];
          if (z < -R * 0.05) { started = false; continue; }
          started ? ctx.lineTo(sx, sy) : ctx.moveTo(sx, sy);
          started = true;
        }
        ctx.strokeStyle = b.color + "80";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // ✈ position derived from globe rotY — fully synced
        // theta=0 (front-center) when lng_rad + rotY = 0 → rotY = -lng_rad
        const rotY_arcStart = -(a.lng * Math.PI / 180);
        const rotY_arcEnd   = -(b.lng * Math.PI / 180);

        // Normalise everything to [0, TAU)
        const norm = (v: number) => ((v % TAU) + TAU) % TAU;
        let rS = norm(rotY_arcStart);
        let rE = norm(rotY_arcEnd);
        let rC = norm(rotY.current);

        // If end < start (wraps), shift so rS < rE
        if (rE < rS) rE += TAU;
        // If current is before start in this window, shift it forward
        if (rC < rS) rC += TAU;

        let planeProg = (rC - rS) / (rE - rS);

        // Only show plane while it is travelling (0..1 range)
        if (planeProg < 0 || planeProg > 1) return;

        const planeIdx = Math.min(Math.floor(planeProg * (pts.length - 1)), pts.length - 2);
        const head = pts[planeIdx + 1];
        const prev = pts[planeIdx];
        if (head && prev && head.z > -R * 0.05) {
          const angle = Math.atan2(head.sy - prev.sy, head.sx - prev.sx);
          drawPlane(ctx, head.sx, head.sy, angle, b.color);
        }
      });

      // --- Location markers ---
      const pulse = (Date.now() % 2200) / 2200;
      STOPS.forEach((stop, i) => {
        const p = project(stop.lat, stop.lng, cx, cy, R, rotY.current);
        if (p.z < 0) return;
        const fa = Math.min(1, arcProg.current * 2.5 - i * 0.25);
        if (fa <= 0) return;

        ctx.save();
        ctx.globalAlpha = fa;

        // Pulse ring
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, 9 + pulse * 13, 0, Math.PI * 2);
        ctx.strokeStyle = stop.color + "45";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Dot
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, 5.5, 0, Math.PI * 2);
        ctx.fillStyle   = stop.color;
        ctx.shadowColor = stop.color;
        ctx.shadowBlur  = 12;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label
        if (p.z > R * 0.08) {
          const right = p.sx > cx;
          ctx.font      = "bold 11px 'JetBrains Mono', monospace";
          ctx.fillStyle = stop.color;
          ctx.textAlign = right ? "left" : "right";
          ctx.fillText(stop.label, p.sx + (right ? 13 : -13), p.sy - 3);
          ctx.font      = "9px monospace";
          ctx.fillStyle = "rgba(148,163,184,0.7)";
          ctx.fillText(stop.sub, p.sx + (right ? 13 : -13), p.sy + 10);
        }

        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [loaded]);

  const onMouseDown = (e: React.MouseEvent) => { dragging.current = true;  lastX.current = e.clientX; };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    rotY.current += (e.clientX - lastX.current) * 0.005;
    lastX.current = e.clientX;
  };
  const onMouseUp = () => { dragging.current = false; };

  return (
    <section className="relative py-32 bg-[#04040a]/60">
      <div className="max-w-5xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="font-mono text-xs text-indigo-400 tracking-[0.2em] uppercase mb-3">
            Career Journey
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-slate-100 mb-3">
            From Guntur to New York
          </h2>
          <p className="text-slate-500 text-sm font-mono">Drag to rotate</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {STOPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                                       bg-slate-900/60 border border-slate-800/40">
              <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
              <span className="font-mono text-[10px] text-slate-200">{i + 1}. {s.label}</span>
              <span className="font-mono text-[9px] text-slate-500">{s.sub}</span>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex justify-center"
        >
          <canvas
            ref={canvasRef}
            width={680}
            height={500}
            className="w-full max-w-2xl rounded-2xl border border-slate-800/40 bg-slate-950/40"
            style={{ cursor: "grab" }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          />
        </motion.div>
      </div>
    </section>
  );
}
