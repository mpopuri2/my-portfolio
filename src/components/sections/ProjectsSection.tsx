"use client";

import { useRef, useState, useCallback } from "react";
import { useSpring as useSpringFramer } from "framer-motion";
import { motion, useInView, AnimatePresence } from "framer-motion";

// ─── Project data ─────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    id: "langraph",
    tag: "Production · Stripe",
    title: "Multi-Agent LangGraph Orchestration",
    tagline: "Real-time fraud triage system processing 70M+ daily transactions",
    description:
      "Architected a multi-agent LangGraph system at Stripe for real-time financial fraud detection. Specialized agents coordinate retrieval, classification, and escalation - processing payment, merchant, and behavioral signals in parallel to triage fraud cases with 89% routing accuracy and sub-150ms latency.",
    metrics: [
      { label: "Daily Transactions", value: "70M+" },
      { label: "False Positive Cut", value: "-22%" },
      { label: "p95 Latency", value: "<150ms" },
      { label: "SLA", value: "99.9%" },
    ],
    stack: ["LangGraph", "PyTorch", "ONNX INT8", "Feast", "ChromaDB", "SageMaker", "EKS", "QLoRA"],
    architecture: [
      { id: "input", label: "Transaction Signal", x: 10, y: 42 },
      { id: "router", label: "ReAct Router", x: 33, y: 42 },
      { id: "retrieval", label: "Case Retrieval", x: 56, y: 20 },
      { id: "ranking", label: "ONNX Ranking", x: 56, y: 42 },
      { id: "persona", label: "Risk Scorer", x: 56, y: 64 },
      { id: "feast", label: "Feast Feature Store", x: 56, y: 86 },
      { id: "output", label: "Fraud Decision", x: 80, y: 42 },
    ],
    edges: [
      ["input", "router"],
      ["router", "retrieval"],
      ["router", "ranking"],
      ["router", "persona"],
      ["router", "feast"],
      ["retrieval", "output"],
      ["ranking", "output"],
      ["persona", "output"],
      ["feast", "ranking"],
    ],
    color: "indigo",
    gradient: "from-indigo-500/20 to-sky-500/20",
    border: "border-indigo-500/30",
    accent: "text-indigo-400",
    dot: "bg-indigo-400",
  },
  {
    id: "finbert",
    tag: "Research · Binghamton University",
    title: "GenAI Earnings Intelligence Engine",
    tagline: "Fine-tuned FinBERT pipeline for real-time earnings call analysis",
    description:
      "Built a multi-modal RAG pipeline that ingests SEC 10-Q/10-K filings and live earnings transcripts, then runs them through a QLoRA fine-tuned FinBERT model to extract sentiment, key financial signals, and forward guidance. Outperforms vanilla GPT-4 on domain-specific financial benchmarks.",
    metrics: [
      { label: "Sentiment Accuracy", value: "94.2%" },
      { label: "Docs Processed", value: "12K+" },
      { label: "Inference Time", value: "~80ms" },
      { label: "Model Params", value: "110M" },
    ],
    stack: ["FinBERT", "QLoRA", "PEFT", "LangChain", "ChromaDB", "FastAPI", "PostgreSQL", "AWS S3"],
    architecture: [
      { id: "sec", label: "SEC Filings / Transcripts", x: 8, y: 42 },
      { id: "chunk", label: "Chunker + Embedder", x: 30, y: 42 },
      { id: "chroma", label: "ChromaDB", x: 52, y: 20 },
      { id: "finbert", label: "QLoRA FinBERT", x: 52, y: 64 },
      { id: "fusion", label: "Signal Fusion", x: 72, y: 42 },
      { id: "out", label: "Intelligence Report", x: 90, y: 42 },
    ],
    edges: [
      ["sec", "chunk"],
      ["chunk", "chroma"],
      ["chunk", "finbert"],
      ["chroma", "fusion"],
      ["finbert", "fusion"],
      ["fusion", "out"],
    ],
    color: "sky",
    gradient: "from-sky-500/20 to-violet-500/20",
    border: "border-sky-500/30",
    accent: "text-sky-400",
    dot: "bg-sky-400",
  },
  {
    id: "jobtracker",
    tag: "Side Project · Open Source",
    title: "Job Tracker Chrome Extension",
    tagline: "One-click job application tracker with AI-powered resume matching",
    description:
      "A Chrome extension that auto-detects job listings on LinkedIn, Glassdoor, and Indeed, then stores and organizes applications with status tracking. Integrated an LLM-powered resume gap-analysis feature that highlights missing keywords between the job description and your resume.",
    metrics: [
      { label: "Privacy", value: "0 servers" },
      { label: "Job Boards", value: "3" },
      { label: "Auth", value: "OAuth 2.0" },
      { label: "License", value: "MIT" },
    ],
    stack: ["React", "TypeScript", "Chrome APIs", "Node.js", "PostgreSQL", "OpenAI API", "Tailwind"],
    architecture: [
      { id: "ext", label: "Chrome Extension", x: 10, y: 42 },
      { id: "detect", label: "Job Detector", x: 30, y: 22 },
      { id: "parser", label: "JD Parser", x: 30, y: 62 },
      { id: "api", label: "Node.js API", x: 55, y: 42 },
      { id: "llm", label: "LLM Gap Analysis", x: 75, y: 22 },
      { id: "db", label: "PostgreSQL", x: 75, y: 62 },
      { id: "dash", label: "Dashboard", x: 92, y: 42 },
    ],
    edges: [
      ["ext", "detect"],
      ["ext", "parser"],
      ["detect", "api"],
      ["parser", "api"],
      ["api", "llm"],
      ["api", "db"],
      ["llm", "dash"],
      ["db", "dash"],
    ],
    color: "violet",
    gradient: "from-violet-500/20 to-indigo-500/20",
    border: "border-violet-500/30",
    accent: "text-violet-400",
    dot: "bg-violet-400",
  },
];

// ─── Architecture diagram ─────────────────────────────────────────────────────

function ArchDiagram({ project }: { project: (typeof PROJECTS)[0] }) {
  const nodeMap = Object.fromEntries(project.architecture.map((n) => [n.id, n]));
  const colorMap: Record<string, string> = {
    indigo: "#818cf8",
    sky: "#38bdf8",
    violet: "#a78bfa",
  };
  const c = colorMap[project.color] ?? "#818cf8";

  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      style={{ overflow: "visible" }}
    >
      {/* edges */}
      {project.edges.map(([a, b], i) => {
        const na = nodeMap[a];
        const nb = nodeMap[b];
        if (!na || !nb) return null;
        return (
          <motion.line
            key={i}
            x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
            stroke={c}
            strokeWidth="0.5"
            strokeOpacity="0.35"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
          />
        );
      })}
      {/* nodes */}
      {project.architecture.map((node, i) => (
        <motion.g
          key={node.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18, delay: i * 0.07 }}
          style={{ transformOrigin: `${node.x}% ${node.y}%` }}
        >
          <circle cx={node.x} cy={node.y} r="3.2" fill={c} fillOpacity="0.15" stroke={c} strokeWidth="0.6" />
          <circle cx={node.x} cy={node.y} r="1.2" fill={c} />
          <text
            x={node.x}
            y={node.y + 6.5}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="3.2"
            fontFamily="monospace"
          >
            {node.label}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}

// ─── Single project card ──────────────────────────────────────────────────────

function ProjectCard({
  project,
  index,
  inView,
}: {
  project: (typeof PROJECTS)[0];
  index: number;
  inView: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLElement>(null);

  // 3D tilt springs
  const rotateX = useSpringFramer(0, { stiffness: 180, damping: 22, mass: 0.4 });
  const rotateY = useSpringFramer(0, { stiffness: 180, damping: 22, mass: 0.4 });
  const glowX   = useSpringFramer(50, { stiffness: 120, damping: 18 });
  const glowY   = useSpringFramer(50, { stiffness: 120, damping: 18 });

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top)  / rect.height;
    rotateX.set((py - 0.5) * -14); // tilt up/down
    rotateY.set((px - 0.5) *  14); // tilt left/right
    glowX.set(px * 100);
    glowY.set(py * 100);
  }, [rotateX, rotateY, glowX, glowY]);

  const onMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    glowX.set(50);
    glowY.set(50);
  }, [rotateX, rotateY, glowX, glowY]);

  return (
    <motion.article
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: "spring", stiffness: 70, damping: 20, delay: index * 0.15 }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
        transformStyle: "preserve-3d",
      }}
      className={`relative rounded-2xl border ${project.border} bg-slate-900/35 backdrop-blur-sm overflow-hidden group`}
    >
      {/* gradient fill on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      {/* cursor-tracked inner glow */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
        style={{
          background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255,255,255,0.06) 0%, transparent 60%)`,
        }}
      />

      <div className="relative p-8">
        {/* header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <span className={`font-mono text-xs tracking-widest uppercase ${project.accent} opacity-70`}>
              {project.tag}
            </span>
            <h3 className="font-display text-2xl font-bold text-slate-100 mt-2 leading-tight">
              {project.title}
            </h3>
            <p className="text-slate-400 text-sm mt-1">{project.tagline}</p>
          </div>
          <div className={`w-3 h-3 rounded-full ${project.dot} shrink-0 mt-1 ring-4 ring-current opacity-20 ${project.accent}`} />
        </div>

        {/* metrics row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {project.metrics.map((m) => (
            <div key={m.label} className="rounded-xl bg-slate-800/60 p-3 text-center">
              <div className={`font-display text-xl font-black ${project.accent}`}>{m.value}</div>
              <div className="text-slate-500 text-xs mt-0.5">{m.label}</div>
            </div>
          ))}
        </div>

        {/* architecture diagram */}
        <div className="rounded-xl bg-slate-950/60 border border-slate-800/50 p-4 mb-6" style={{ height: 160 }}>
          <p className="font-mono text-[10px] text-slate-600 tracking-widest uppercase mb-2">
            // Architecture
          </p>
          <div style={{ height: 120 }}>
            <ArchDiagram project={project} />
          </div>
        </div>

        {/* expandable description */}
        <AnimatePresence>
          {expanded && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 28 }}
              className="text-slate-400 text-sm leading-relaxed mb-4 overflow-hidden"
            >
              {project.description}
            </motion.p>
          )}
        </AnimatePresence>

        {/* tech stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.stack.map((t) => (
            <span
              key={t}
              className="font-mono text-xs px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/50"
            >
              {t}
            </span>
          ))}
        </div>

        {/* actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className={`font-mono text-xs ${project.accent} hover:opacity-80 transition-opacity`}
          >
            {expanded ? "[ collapse ]" : "[ read more ]"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function ProjectsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="projects" ref={ref} className="relative z-10 bg-[#04040a]/60 py-32 px-6">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-xs text-indigo-400/70 tracking-[0.25em] uppercase mb-4">
            Featured Work
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-black text-slate-100">
            Projects that{" "}
            <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              ship and scale
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
