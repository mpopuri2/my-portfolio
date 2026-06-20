"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

const METRICS = [
  {
    value: 70,
    suffix: "M+",
    label: "Daily Transactions",
    sub: "processed through LangGraph orchestration",
    color: "from-indigo-400 to-sky-400",
  },
  {
    value: 22,
    suffix: "%",
    label: "False Positive Rate Cut",
    sub: "in fraud triage via LangGraph multi-agent system",
    color: "from-sky-400 to-violet-400",
  },
  {
    value: 150,
    prefix: "<",
    suffix: "ms",
    label: "p95 Latency",
    sub: "ONNX INT8 quantized inference at Stripe",
    color: "from-violet-400 to-indigo-400",
  },
  {
    value: 99.9,
    suffix: "%",
    label: "SLA Maintained",
    sub: "production uptime on SageMaker + EKS",
    color: "from-indigo-400 to-violet-400",
  },
];

function useCountUp(target: number, duration = 1800, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const isDecimal = target % 1 !== 0;
    const raf = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      const val = eased * target;
      setCount(isDecimal ? Math.round(val * 10) / 10 : Math.floor(val));
      if (t < 1) requestAnimationFrame(raf);
      else setCount(target);
    };
    requestAnimationFrame(raf);
  }, [active, target, duration]);
  return count;
}

function MetricCard({
  metric,
  index,
  active,
}: {
  metric: (typeof METRICS)[0];
  index: number;
  active: boolean;
}) {
  const count = useCountUp(metric.value, 1800, active);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ type: "spring", stiffness: 80, damping: 20, delay: index * 0.12 }}
      className="relative group"
    >
      <div className="relative rounded-2xl border border-slate-800/60 bg-slate-900/20 backdrop-blur-sm p-8 overflow-hidden hover:border-slate-700/80 transition-colors duration-300">
        {/* gradient accent top bar */}
        <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${metric.color} opacity-60`} />
        {/* hover glow */}
        <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`} />

        <div className={`font-display text-5xl font-black bg-gradient-to-r ${metric.color} bg-clip-text text-transparent mb-2 tabular-nums`}>
          {metric.prefix ?? ""}
          {count}
          {metric.suffix}
        </div>
        <div className="text-slate-100 font-semibold text-lg mb-1">{metric.label}</div>
        <div className="text-slate-500 text-sm leading-relaxed">{metric.sub}</div>
      </div>
    </motion.div>
  );
}

export default function ImpactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section id="impact" ref={ref} className="relative z-10 bg-[#04040a]/60 py-32 px-6">
      {/* subtle top separator */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-xs text-indigo-400/70 tracking-[0.25em] uppercase mb-4">
            Production Impact
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-black text-slate-100">
            Systems that{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-violet-400 bg-clip-text text-transparent">
              move the needle
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {METRICS.map((m, i) => (
            <MetricCard key={m.label} metric={m} index={i} active={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
