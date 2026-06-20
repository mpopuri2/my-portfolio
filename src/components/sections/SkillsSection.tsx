"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

/* ── Skill graph data ──────────────────────────────────────────────── */

interface SkillNode {
  id: string;
  label: string;
  group: "ml" | "llm" | "cloud" | "data" | "lang" | "core";
  level: number; // 1-3, affects node size
}

interface SkillEdge { source: string; target: string }

const NODES: SkillNode[] = [
  // Core
  { id: "python",      label: "Python",      group: "core",  level: 3 },
  // ML
  { id: "pytorch",     label: "PyTorch",     group: "ml",    level: 3 },
  { id: "tensorflow",  label: "TensorFlow",  group: "ml",    level: 2 },
  { id: "sklearn",     label: "Scikit-learn",group: "ml",    level: 2 },
  { id: "xgboost",     label: "XGBoost",     group: "ml",    level: 2 },
  { id: "finbert",     label: "FinBERT",     group: "ml",    level: 2 },
  // LLM / Agent
  { id: "langchain",   label: "LangChain",   group: "llm",   level: 3 },
  { id: "langgraph",   label: "LangGraph",   group: "llm",   level: 3 },
  { id: "rag",         label: "RAG",         group: "llm",   level: 2 },
  { id: "shap",        label: "SHAP",        group: "llm",   level: 1 },
  // Cloud / MLOps
  { id: "aws",         label: "AWS",         group: "cloud", level: 3 },
  { id: "gcp",         label: "GCP",         group: "cloud", level: 2 },
  { id: "docker",      label: "Docker",      group: "cloud", level: 2 },
  { id: "k8s",         label: "Kubernetes",  group: "cloud", level: 2 },
  { id: "mlflow",      label: "MLflow",      group: "cloud", level: 2 },
  { id: "airflow",     label: "Airflow",     group: "cloud", level: 1 },
  // Data
  { id: "spark",       label: "Spark",       group: "data",  level: 2 },
  { id: "kafka",       label: "Kafka",       group: "data",  level: 2 },
  { id: "sql",         label: "SQL",         group: "data",  level: 2 },
  { id: "redis",       label: "Redis",       group: "data",  level: 1 },
  // Languages
  { id: "typescript",  label: "TypeScript",  group: "lang",  level: 2 },
  { id: "go",          label: "Go",          group: "lang",  level: 1 },
];

const EDGES: SkillEdge[] = [
  { source: "python",     target: "pytorch"    },
  { source: "python",     target: "tensorflow" },
  { source: "python",     target: "sklearn"    },
  { source: "python",     target: "xgboost"   },
  { source: "python",     target: "langchain"  },
  { source: "python",     target: "spark"      },
  { source: "pytorch",    target: "finbert"    },
  { source: "langchain",  target: "langgraph"  },
  { source: "langchain",  target: "rag"        },
  { source: "langgraph",  target: "rag"        },
  { source: "sklearn",    target: "shap"       },
  { source: "xgboost",    target: "shap"       },
  { source: "aws",        target: "docker"     },
  { source: "aws",        target: "k8s"        },
  { source: "aws",        target: "mlflow"     },
  { source: "docker",     target: "k8s"        },
  { source: "mlflow",     target: "airflow"    },
  { source: "spark",      target: "kafka"      },
  { source: "spark",      target: "sql"        },
  { source: "kafka",      target: "redis"      },
  { source: "python",     target: "typescript" },
  { source: "typescript", target: "go"         },
  { source: "aws",        target: "gcp"        },
];

const GROUP_COLORS: Record<SkillNode["group"], { fill: string; glow: string; text: string }> = {
  core:  { fill: "#f59e0b", glow: "rgba(245,158,11,0.5)",  text: "#fde68a" },
  ml:    { fill: "#818cf8", glow: "rgba(129,140,248,0.5)", text: "#c7d2fe" },
  llm:   { fill: "#38bdf8", glow: "rgba(56,189,248,0.5)",  text: "#bae6fd" },
  cloud: { fill: "#34d399", glow: "rgba(52,211,153,0.5)",  text: "#a7f3d0" },
  data:  { fill: "#f472b6", glow: "rgba(244,114,182,0.5)", text: "#fbcfe8" },
  lang:  { fill: "#a78bfa", glow: "rgba(167,139,250,0.5)", text: "#ddd6fe" },
};

const GROUP_LABELS: Record<SkillNode["group"], string> = {
  core:  "Core",
  ml:    "Machine Learning",
  llm:   "LLM / Agents",
  cloud: "Cloud & MLOps",
  data:  "Data Engineering",
  lang:  "Languages",
};

/* ── Force simulation (no D3 dependency) ──────────────────────────── */

interface SimNode extends SkillNode {
  x: number; y: number;
  vx: number; vy: number;
}

function initSim(width: number, height: number): SimNode[] {
  // Arrange by group in rough sectors
  const groupAngles: Record<string, number> = {
    core: 0, ml: 60, llm: 120, cloud: 180, data: 240, lang: 300,
  };
  return NODES.map((n, i) => {
    const angle = ((groupAngles[n.group] ?? 0) + (i % 4) * 15) * (Math.PI / 180);
    const r = n.group === "core" ? 0 : 120 + n.level * 30;
    return {
      ...n,
      x:  width  / 2 + Math.cos(angle) * r + (Math.random() - 0.5) * 40,
      y:  height / 2 + Math.sin(angle) * r + (Math.random() - 0.5) * 40,
      vx: 0, vy: 0,
    };
  });
}

function tickSim(nodes: SimNode[], width: number, height: number, alpha: number) {
  const cx = width / 2, cy = height / 2;
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  // Repulsion
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const dist = Math.max(Math.hypot(dx, dy), 1);
      const strength = 2200 / (dist * dist);
      const nx = dx / dist * strength * alpha;
      const ny = dy / dist * strength * alpha;
      a.vx += nx; a.vy += ny;
      b.vx -= nx; b.vy -= ny;
    }
  }

  // Attraction along edges
  for (const e of EDGES) {
    const a = nodeMap.get(e.source), b = nodeMap.get(e.target);
    if (!a || !b) continue;
    const dx = b.x - a.x, dy = b.y - a.y;
    const dist = Math.max(Math.hypot(dx, dy), 1);
    const ideal = 110;
    const f = (dist - ideal) * 0.03 * alpha;
    a.vx += dx / dist * f; a.vy += dy / dist * f;
    b.vx -= dx / dist * f; b.vy -= dy / dist * f;
  }

  // Center gravity
  for (const n of nodes) {
    n.vx += (cx - n.x) * 0.008 * alpha;
    n.vy += (cy - n.y) * 0.008 * alpha;
  }

  // Integrate + dampen + clamp
  const PAD = 60;
  for (const n of nodes) {
    n.vx *= 0.78; n.vy *= 0.78;
    n.x = Math.max(PAD, Math.min(width - PAD, n.x + n.vx));
    n.y = Math.max(PAD, Math.min(height - PAD, n.y + n.vy));
  }
}

/* ── Component ─────────────────────────────────────────────────────── */

export default function SkillsSection() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const nodesRef   = useRef<SimNode[]>([]);
  const rafRef     = useRef<number>(0);
  const ticksRef   = useRef(0);
  const wrapRef    = useRef<HTMLDivElement>(null);
  const [hovered,  setHovered]  = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [tooltip,  setTooltip]  = useState<{ x: number; y: number; node: SimNode } | null>(null);
  const [dims,     setDims]     = useState({ w: 800, h: 480 });

  // Resize observer
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      const h = Math.max(380, Math.min(520, width * 0.6));
      setDims({ w: width, h });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Init simulation
  useEffect(() => {
    nodesRef.current = initSim(dims.w, dims.h);
    ticksRef.current = 0;
  }, [dims]);

  // Draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const activeId = selected ?? hovered;
    const connectedIds = new Set<string>();
    if (activeId) {
      EDGES.forEach((e) => {
        if (e.source === activeId) connectedIds.add(e.target);
        if (e.target === activeId) connectedIds.add(e.source);
      });
    }

    const draw = () => {
      // Run simulation for first 180 ticks
      if (ticksRef.current < 180) {
        const alpha = Math.max(0.05, 1 - ticksRef.current / 140);
        tickSim(nodesRef.current, dims.w, dims.h, alpha);
        ticksRef.current++;
      }

      ctx.clearRect(0, 0, dims.w, dims.h);

      const nodes = nodesRef.current;
      const nodeMap = new Map(nodes.map((n) => [n.id, n]));

      // Draw edges
      for (const e of EDGES) {
        const a = nodeMap.get(e.source), b = nodeMap.get(e.target);
        if (!a || !b) continue;

        const isActive = activeId && (e.source === activeId || e.target === activeId);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = isActive
          ? `rgba(129,140,248,0.6)`
          : "rgba(100,116,139,0.18)";
        ctx.lineWidth = isActive ? 1.5 : 0.8;
        ctx.stroke();
      }

      // Draw nodes
      for (const n of nodes) {
        const col = GROUP_COLORS[n.group];
        const r   = n.level === 3 ? 14 : n.level === 2 ? 10 : 7;
        const isActive    = n.id === activeId;
        const isConnected = connectedIds.has(n.id);
        const isDimmed    = activeId && !isActive && !isConnected;

        const alpha = isDimmed ? 0.25 : 1;

        ctx.save();
        ctx.globalAlpha = alpha;

        // Glow
        if (isActive || isConnected) {
          const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 3.5);
          grd.addColorStop(0, col.glow);
          grd.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(n.x, n.y, r * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? col.fill : isConnected ? col.fill : "rgba(15,23,42,0.9)";
        ctx.fill();
        ctx.strokeStyle = col.fill;
        ctx.lineWidth = isActive ? 2.5 : 1.5;
        ctx.stroke();

        // Label
        ctx.font = `${n.level === 3 ? 11 : 10}px monospace`;
        ctx.fillStyle = col.text;
        ctx.textAlign = "center";
        ctx.fillText(n.label, n.x, n.y + r + 13);

        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [dims, hovered, selected]);

  // Mouse interaction
  const getNodeAt = useCallback((cx: number, cy: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const mx = (cx - rect.left) * (dims.w / rect.width);
    const my = (cy - rect.top)  * (dims.h / rect.height);
    for (const n of nodesRef.current) {
      const r = n.level === 3 ? 18 : n.level === 2 ? 14 : 10;
      if (Math.hypot(n.x - mx, n.y - my) < r) return { node: n, mx, my };
    }
    return null;
  }, [dims]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const hit = getNodeAt(e.clientX, e.clientY);
    if (hit) {
      setHovered(hit.node.id);
      setTooltip({ x: e.clientX, y: e.clientY, node: hit.node });
    } else {
      setHovered(null);
      setTooltip(null);
    }
  }, [getNodeAt]);

  const onClick = useCallback((e: React.MouseEvent) => {
    const hit = getNodeAt(e.clientX, e.clientY);
    setSelected(hit ? (selected === hit.node.id ? null : hit.node.id) : null);
  }, [getNodeAt, selected]);

  return (
    <section id="skills" className="relative py-32 bg-[#04040a]/60">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="font-mono text-xs text-indigo-400 tracking-[0.2em] uppercase mb-3">
            Technical Expertise
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-slate-100 mb-4">
            Skills Constellation
          </h2>
          <p className="text-slate-500 text-sm font-mono">
            Click a node to explore connections. Drag to rearrange.
          </p>
        </motion.div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {(Object.entries(GROUP_COLORS) as [SkillNode["group"], typeof GROUP_COLORS[SkillNode["group"]]][]).map(([g, c]) => (
            <div key={g} className="flex items-center gap-1.5 px-3 py-1 rounded-full
                                    bg-slate-900/60 border border-slate-800/40">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.fill }} />
              <span className="font-mono text-[10px] text-slate-400">{GROUP_LABELS[g]}</span>
            </div>
          ))}
        </div>

        {/* Canvas */}
        <motion.div
          ref={wrapRef}
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative rounded-2xl overflow-hidden border border-slate-800/40
                     bg-slate-950/40 backdrop-blur-sm"
        >
          <canvas
            ref={canvasRef}
            width={dims.w}
            height={dims.h}
            className="w-full"
            style={{ cursor: hovered ? "pointer" : "default" }}
            onMouseMove={onMouseMove}
            onMouseLeave={() => { setHovered(null); setTooltip(null); }}
            onClick={onClick}
          />

          {/* Tooltip */}
          {tooltip && (
            <div
              className="fixed z-50 pointer-events-none px-3 py-1.5 rounded-lg
                         bg-slate-900/95 border border-slate-700/60
                         font-mono text-xs text-slate-200 shadow-xl"
              style={{ left: tooltip.x + 14, top: tooltip.y - 8 }}
            >
              {tooltip.node.label}
              <span className="ml-2 text-slate-500">
                {GROUP_LABELS[tooltip.node.group]}
              </span>
            </div>
          )}
        </motion.div>

        {selected && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center font-mono text-xs text-indigo-400 mt-4"
          >
            Showing connections for{" "}
            <span className="text-slate-200">
              {nodesRef.current.find((n) => n.id === selected)?.label}
            </span>
            {" "}- click again to deselect
          </motion.p>
        )}
      </div>
    </section>
  );
}
