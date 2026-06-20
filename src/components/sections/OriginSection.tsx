"use client";

import { useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";

// ── Types ──────────────────────────────────────────────────────────────────────

interface NetNode {
  id: string;
  x: number;
  y: number;
  label: string;
  sub: string;
  emoji: string;
  layer: number;
  r: number;
  fill: string;
  glow: string;
  stroke: string;
}

interface NetEdge {
  from: string;
  to: string;
  color: string;
}

// ── Network layout (viewBox 1060 × 580) ───────────────────────────────────────

const NODES: NetNode[] = [
  // L0 - Inputs (warm amber)
  {
    id: "parents", x: 80, y: 145,
    label: "Parents", sub: "Sacrifice & Belief", emoji: "🙏",
    layer: 0, r: 32, fill: "#fde68a", glow: "#f59e0b", stroke: "#fbbf24",
  },
  {
    id: "passion", x: 80, y: 290,
    label: "Curiosity", sub: "& Drive", emoji: "🔥",
    layer: 0, r: 25, fill: "#fed7aa", glow: "#fb923c", stroke: "#fdba74",
  },
  {
    id: "hardwork", x: 80, y: 430,
    label: "Hard Work", sub: "Sleepless Nights", emoji: "💪",
    layer: 0, r: 32, fill: "#fde68a", glow: "#f59e0b", stroke: "#fbbf24",
  },

  // L1 - Formation (sky)
  {
    id: "btech", x: 300, y: 185,
    label: "B.Tech", sub: "VVIT · 2019-21", emoji: "🎓",
    layer: 1, r: 28, fill: "#7dd3fc", glow: "#0ea5e9", stroke: "#38bdf8",
  },
  {
    id: "ms", x: 300, y: 390,
    label: "M.S. CS", sub: "Binghamton · 25", emoji: "🏛️",
    layer: 1, r: 34, fill: "#38bdf8", glow: "#0284c7", stroke: "#0ea5e9",
  },

  // L2 - Capabilities (indigo / violet)
  {
    id: "ml", x: 520, y: 108,
    label: "ML & DL", sub: "PyTorch · JAX", emoji: "🧠",
    layer: 2, r: 24, fill: "#a5b4fc", glow: "#6366f1", stroke: "#818cf8",
  },
  {
    id: "genai", x: 520, y: 228,
    label: "GenAI", sub: "LLMs · RAG", emoji: "✨",
    layer: 2, r: 24, fill: "#a5b4fc", glow: "#6366f1", stroke: "#818cf8",
  },
  {
    id: "agentic", x: 520, y: 350,
    label: "Agentic AI", sub: "LangGraph · ReAct", emoji: "🤖",
    layer: 2, r: 24, fill: "#c4b5fd", glow: "#8b5cf6", stroke: "#a78bfa",
  },
  {
    id: "research", x: 520, y: 468,
    label: "Research", sub: "Published · 97.4%", emoji: "📝",
    layer: 2, r: 21, fill: "#a5b4fc", glow: "#6366f1", stroke: "#818cf8",
  },

  // L3 - Experience (violet / fuchsia / sky)
  {
    id: "cognizant", x: 745, y: 145,
    label: "Cognizant", sub: "ML Eng · 21-23", emoji: "⚙️",
    layer: 3, r: 26, fill: "#d8b4fe", glow: "#a855f7", stroke: "#c084fc",
  },
  {
    id: "ra", x: 745, y: 290,
    label: "Res. Asst.", sub: "Binghamton · 24-25", emoji: "🔬",
    layer: 3, r: 28, fill: "#93c5fd", glow: "#3b82f6", stroke: "#60a5fa",
  },
  {
    id: "stripe", x: 745, y: 435,
    label: "Stripe", sub: "AI Eng · 2025-", emoji: "⚡",
    layer: 3, r: 36, fill: "#c084fc", glow: "#7c3aed", stroke: "#a855f7",
  },

  // L4 - Output (gradient / special)
  {
    id: "manju", x: 970, y: 290,
    label: "Manjunath", sub: "AI Engineer", emoji: "🚀",
    layer: 4, r: 56, fill: "#818cf8", glow: "#4f46e5", stroke: "#6366f1",
  },
];

const EDGES: NetEdge[] = [
  // Inputs → Formation
  { from: "parents",  to: "btech",   color: "#f59e0b" },
  { from: "parents",  to: "ms",      color: "#f59e0b" },
  { from: "passion",  to: "btech",   color: "#fb923c" },
  { from: "passion",  to: "ms",      color: "#fb923c" },
  { from: "hardwork", to: "btech",   color: "#f59e0b" },
  { from: "hardwork", to: "ms",      color: "#f59e0b" },
  // Formation → Capabilities
  { from: "btech", to: "ml",       color: "#38bdf8" },
  { from: "btech", to: "genai",    color: "#38bdf8" },
  { from: "btech", to: "research", color: "#38bdf8" },
  { from: "ms",    to: "ml",       color: "#0ea5e9" },
  { from: "ms",    to: "genai",    color: "#0ea5e9" },
  { from: "ms",    to: "agentic",  color: "#0ea5e9" },
  { from: "ms",    to: "research", color: "#0ea5e9" },
  // Capabilities → Experience
  { from: "ml",       to: "cognizant", color: "#818cf8" },
  { from: "genai",    to: "cognizant", color: "#818cf8" },
  { from: "ml",       to: "ra",        color: "#38bdf8" },
  { from: "research", to: "ra",        color: "#38bdf8" },
  { from: "genai",    to: "ra",        color: "#38bdf8" },
  { from: "ml",       to: "stripe",    color: "#6366f1" },
  { from: "genai",    to: "stripe",    color: "#6366f1" },
  { from: "agentic",  to: "stripe",    color: "#8b5cf6" },
  { from: "research", to: "stripe",    color: "#6366f1" },
  // Experience → Output
  { from: "cognizant", to: "manju", color: "#a855f7" },
  { from: "ra",        to: "manju", color: "#3b82f6" },
  { from: "stripe",    to: "manju", color: "#7c3aed" },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function nodeById(id: string): NetNode {
  return NODES.find((n) => n.id === id)!;
}

// Stable pseudo-random (seeded by index, no Math.random in render)
function seeded(i: number, salt: number): number {
  const x = Math.sin(i * 9301 + salt * 49297) * 0.5 + 0.5;
  return x;
}

// ── Edge line with draw-in ─────────────────────────────────────────────────────

function EdgeLine({
  edge, inView, delay,
}: { edge: NetEdge; inView: boolean; delay: number }) {
  const a = nodeById(edge.from);
  const b = nodeById(edge.to);
  // Round to integer - prevents SSR/client float serialization mismatch (hydration error)
  const len = Math.ceil(Math.hypot(b.x - a.x, b.y - a.y));

  return (
    <motion.line
      x1={a.x} y1={a.y} x2={b.x} y2={b.y}
      stroke={edge.color}
      strokeWidth={1.4}
      strokeOpacity={0.35}
      strokeDasharray={len}
      initial={{ strokeDashoffset: len, opacity: 0 }}
      animate={inView ? { strokeDashoffset: 0, opacity: 1 } : {}}
      transition={{ duration: 0.85, delay, ease: "easeOut" }}
    />
  );
}

// ── Traveling signal dot ───────────────────────────────────────────────────────

function SignalDot({
  edge, idx, startDelay,
}: { edge: NetEdge; idx: number; startDelay: number }) {
  const a = nodeById(edge.from);
  const b = nodeById(edge.to);
  const period = 1.4 + seeded(idx, 7) * 0.8;
  const repeatDelay = 1.2 + seeded(idx, 13) * 2.5;

  return (
    <motion.circle
      r={2.8}
      fill={edge.color}
      style={{ filter: `drop-shadow(0 0 5px ${edge.color})` }}
      initial={{ cx: a.x, cy: a.y, opacity: 0 }}
      animate={{
        cx: [a.x, b.x],
        cy: [a.y, b.y],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: period,
        delay: startDelay,
        repeat: Infinity,
        repeatDelay,
        ease: "linear",
        times: [0, 0.08, 0.92, 1],
      }}
    />
  );
}

// ── Node circle ────────────────────────────────────────────────────────────────

function NodeCircle({
  node, inView, delay,
}: { node: NetNode; inView: boolean; delay: number }) {
  const isOutput = node.layer === 4;
  const isInput  = node.layer === 0;
  const fs = isOutput ? 11 : isInput ? 10 : 9;

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.3 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ type: "spring", stiffness: 180, damping: 20, delay }}
      style={{ transformOrigin: `${node.x}px ${node.y}px` }}
    >
      {/* Outer glow pulse */}
      <motion.circle
        cx={node.x} cy={node.y} r={node.r + (isOutput ? 14 : 8)}
        fill="none"
        stroke={node.glow}
        strokeWidth={isOutput ? 2 : 1}
        strokeOpacity={0.25}
        animate={{ r: [node.r + 6, node.r + (isOutput ? 18 : 12), node.r + 6] }}
        transition={{
          duration: 2.5 + node.layer * 0.4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: node.layer * 0.2,
        }}
      />
      {/* Node body */}
      <circle
        cx={node.x} cy={node.y} r={node.r}
        fill={node.fill}
        fillOpacity={isOutput ? 0.2 : 0.12}
        stroke={node.stroke}
        strokeWidth={isOutput ? 2.5 : 1.8}
      />
      {/* Photo (output) or emoji (all other nodes) */}
      {isOutput ? (
        <image
          href="/my_image.jpeg"
          x={node.x - 51}
          y={node.y - 51}
          width={102}
          height={102}
          clipPath="url(#output-photo-clip)"
          preserveAspectRatio="xMidYMid slice"
        />
      ) : (
        <text
          x={node.x}
          y={node.y - 10}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={12}
        >
          {node.emoji}
        </text>
      )}
      {/* Label - below circle for output, inside for others */}
      <text
        x={node.x}
        y={isOutput ? node.y + node.r + 14 : node.y + 4}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={node.fill}
        fontSize={fs}
        fontWeight="700"
        fontFamily="'Space Mono', monospace"
      >
        {node.label}
      </text>
      {/* Sub-label */}
      <text
        x={node.x}
        y={isOutput ? node.y + node.r + 24 : node.y + 14}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={node.fill}
        fontSize={isOutput ? 7.5 : 6.5}
        fontFamily="'Space Mono', monospace"
        fillOpacity={0.65}
      >
        {node.sub}
      </text>
    </motion.g>
  );
}

// ── Layer labels at top ────────────────────────────────────────────────────────

const LAYER_META = [
  { x: 80,  label: "INPUTS",       color: "#f59e0b" },
  { x: 300, label: "FORMATION",    color: "#38bdf8" },
  { x: 520, label: "CAPABILITIES", color: "#818cf8" },
  { x: 745, label: "EXPERIENCE",   color: "#c084fc" },
  { x: 970, label: "OUTPUT",       color: "#6366f1" },
];

// ── Section export ─────────────────────────────────────────────────────────────

export default function OriginSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  // Stable delays - no Math.random in render
  const nodeDelays = useMemo(
    () => Object.fromEntries(
      NODES.map((n, i) => [n.id, 0.25 + n.layer * 0.22 + seeded(i, 3) * 0.1])
    ),
    []
  );

  const edgeDelays = useMemo(
    () => EDGES.map((e) => 0.5 + nodeById(e.from).layer * 0.22),
    []
  );

  return (
    <section ref={ref} className="relative z-10 bg-[#020209]/60 py-28 px-4 overflow-hidden">
      {/* Top divider */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-900/50 to-transparent" />

      {/* Subtle radial glow centered on the output node */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 40% 50% at 92% 50%, rgba(99,102,241,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-14 max-w-2xl mx-auto"
      >
        <p className="font-mono text-xs text-amber-500/70 tracking-[0.25em] uppercase mb-4">
          Origin Story
        </p>
        <h2 className="font-display text-4xl md:text-5xl font-black text-slate-100 mb-5">
          The network that{" "}
          <span className="bg-gradient-to-r from-amber-400 via-sky-400 to-violet-400 bg-clip-text text-transparent">
            trained me
          </span>
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed">
          Every ML model has a training process. Mine ran for 24 years - initialized by family,
          regularized by struggle, and fine-tuned across two countries and a thousand late nights.
        </p>
      </motion.div>

      {/* ── SVG Network ── */}
      <div className="max-w-6xl mx-auto overflow-x-auto">
        <svg
          viewBox="0 0 1060 575"
          className="w-full min-w-[700px]"
          style={{ maxHeight: 540 }}
          role="img"
          aria-label="Personal neural network: parents and hard work as inputs, education and skills as hidden layers, Manjunath Popuri as output"
        >
          <defs>
            <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="output-body" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#818cf8" stopOpacity="0.28" />
              <stop offset="60%"  stopColor="#6366f1" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.04" />
            </radialGradient>
            {/* Clip photo to circle for output node */}
            <clipPath id="output-photo-clip">
              <circle cx="970" cy="290" r="51" />
            </clipPath>
          </defs>

          {/* ── Layer dividers ── */}
          {[192, 412, 634, 856].map((x) => (
            <motion.line
              key={x} x1={x} y1={44} x2={x} y2={546}
              stroke="#1e293b" strokeWidth={1} strokeDasharray="3 7"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 0.7 } : {}}
              transition={{ delay: 0.1 }}
            />
          ))}

          {/* ── Layer labels ── */}
          {LAYER_META.map((l) => (
            <motion.text
              key={l.label}
              x={l.x} y={26}
              textAnchor="middle"
              fill={l.color}
              fontSize={7.5}
              fontFamily="monospace"
              letterSpacing={2}
              fillOpacity={0.7}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
            >
              {l.label}
            </motion.text>
          ))}

          {/* ── Edges ── */}
          {EDGES.map((edge, i) => (
            <EdgeLine key={`e${i}`} edge={edge} inView={inView} delay={edgeDelays[i]} />
          ))}

          {/* ── Signals ── */}
          {inView && EDGES.map((edge, i) => (
            <SignalDot key={`s${i}`} edge={edge} idx={i} startDelay={1.4 + i * 0.16} />
          ))}

          {/* ── Nodes ── */}
          {NODES.map((node) => (
            <NodeCircle
              key={node.id}
              node={node}
              inView={inView}
              delay={nodeDelays[node.id]}
            />
          ))}

          {/* ── Output special outer ring ── */}
          <motion.circle
            cx={970} cy={290} r={72}
            fill="none"
            stroke="#6366f1"
            strokeWidth={1}
            strokeDasharray="6 9"
            initial={{ opacity: 0, rotate: 0 }}
            animate={inView ? { opacity: [0.2, 0.5, 0.2], rotate: 360 } : {}}
            transition={{
              opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 18, repeat: Infinity, ease: "linear" },
            }}
            style={{ transformOrigin: "970px 290px" }}
          />

          {/* Second rotating ring - opposite direction */}
          <motion.circle
            cx={970} cy={290} r={86}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth={0.8}
            strokeDasharray="3 14"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: [0.12, 0.3, 0.12], rotate: -360 } : {}}
            transition={{
              opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 26, repeat: Infinity, ease: "linear" },
            }}
            style={{ transformOrigin: "970px 290px" }}
          />
        </svg>
      </div>

      {/* ── Bottom stats ── */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 2.0, duration: 0.6 }}
        className="max-w-3xl mx-auto mt-12 grid grid-cols-3 gap-5 text-center"
      >
        {[
          { value: "2",   label: "Inputs",      sub: "parents who believed",      color: "from-amber-400 to-orange-400" },
          { value: "∞",   label: "Epochs",      sub: "nights of grinding",        color: "from-sky-400 to-indigo-400"  },
          { value: "1",   label: "Output",      sub: "AI engineer at Stripe",     color: "from-violet-400 to-fuchsia-400" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-slate-900/20 border border-slate-800/50 p-5"
          >
            <div className={`font-display text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.value}
            </div>
            <div className="font-mono text-xs text-slate-500 uppercase tracking-wider mt-1">
              {stat.label}
            </div>
            <div className="text-slate-600 text-xs mt-1">{stat.sub}</div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
