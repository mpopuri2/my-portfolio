"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const EVENTS = [
  {
    year: "Aug 2019",
    type: "education",
    title: "B.Tech Computer Science & Engineering",
    org: "VVIT, Guntur, India",
    detail: "Vasireddy Venkatadri Institute of Technology · Aug 2019 - Jun 2023 · GPA 8.28/10",
    color: "sky",
    accent: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/30",
    dot: "bg-sky-400",
    ring: "ring-sky-400/20",
    icon: "◎",
  },
  {
    year: "Jul 2021",
    type: "experience",
    title: "ML Engineer",
    org: "Cognizant",
    detail: "Campus hire during B.Tech · XGBoost + LSTM credit default models · AWS SageMaker · -30% inference latency · Jul 2021 - Jun 2023",
    color: "violet",
    accent: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    dot: "bg-violet-400",
    ring: "ring-violet-400/20",
    icon: "◈",
  },
  {
    year: "Aug 2023",
    type: "education",
    title: "M.S. Computer Science",
    org: "Binghamton University, NY",
    detail: "AI Specialization · GPA 3.54/4.0 · State University of New York · Aug 2023 - May 2025",
    color: "indigo",
    accent: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/30",
    dot: "bg-indigo-400",
    ring: "ring-indigo-400/20",
    icon: "◎",
  },
  {
    year: "Aug 2024",
    type: "experience",
    title: "Graduate Research Assistant",
    org: "Binghamton University",
    detail: "FinBERT on 3,000+ earnings call transcripts · 14% F1 improvement · LangGraph agentic summarization · -30% analyst review time · Aug 2024 - May 2025",
    color: "sky",
    accent: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/30",
    dot: "bg-sky-400",
    ring: "ring-sky-400/20",
    icon: "◎",
  },
  {
    year: "May 2025",
    type: "milestone",
    title: "M.S. Graduated",
    org: "Binghamton University",
    detail: "AI Specialization · GPA 3.54/4.0 · Research in NLP & Multi-Agent Agentic Systems",
    color: "emerald",
    accent: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    dot: "bg-emerald-400",
    ring: "ring-emerald-400/20",
    icon: "✦",
  },
  {
    year: "Jul 2025",
    type: "experience",
    title: "AI / ML Engineer",
    org: "Stripe",
    detail: "LangGraph · 70M+ daily txns · 22% false-positive rate cut · <150ms p95",
    color: "indigo",
    accent: "text-indigo-400",
    bg: "bg-indigo-500/10 group-hover:bg-indigo-500/15",
    border: "border-indigo-500/40",
    dot: "bg-indigo-400",
    ring: "ring-indigo-400/30",
    icon: "◆",
    featured: true,
  },
  {
    year: "Present",
    type: "now",
    title: "Building production AI at scale",
    org: "New York, NY",
    detail: "Open to senior AI/ML roles, applied science, and research collaborations",
    color: "sky",
    accent: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/30",
    dot: "bg-sky-400",
    ring: "ring-sky-400/30",
    icon: "▶",
  },
];

function TimelineNode({
  event,
  index,
  inView,
  isLeft,
}: {
  event: (typeof EVENTS)[0];
  index: number;
  inView: boolean;
  isLeft: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const nodeInView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <div
      ref={ref}
      className={`relative flex items-center gap-0 ${isLeft ? "flex-row" : "flex-row-reverse"} group`}
    >
      {/* card */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
        animate={nodeInView ? { opacity: 1, x: 0 } : {}}
        transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.05 }}
        className={`w-[calc(50%-2rem)] rounded-2xl border ${event.border} ${event.bg} p-5 backdrop-blur-sm transition-all duration-300 group-hover:scale-[1.02] ${event.featured ? "shadow-lg shadow-indigo-500/10" : ""}`}
      >
        {event.featured && (
          <div className="h-px bg-gradient-to-r from-indigo-500 via-sky-400 to-violet-500 -mx-5 mb-4" style={{ marginTop: "-1.25rem" }} />
        )}
        <div className={`font-mono text-xs ${event.accent} opacity-70 mb-1`}>
          {event.year} · {event.type.toUpperCase()}
        </div>
        <div className="font-display font-bold text-slate-100 text-base leading-tight">
          {event.title}
        </div>
        <div className={`font-semibold text-sm ${event.accent} mt-0.5`}>{event.org}</div>
        <div className="text-slate-500 text-xs mt-1.5 leading-relaxed">{event.detail}</div>
      </motion.div>

      {/* spacer to center line */}
      <div className="w-16 flex-shrink-0" />

      {/* dot + connector line */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={nodeInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 }}
        className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full ${event.dot} ring-4 ${event.ring} z-10 flex items-center justify-center`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
      </motion.div>
    </div>
  );
}

export default function TimelineSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.05 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 0.9], ["0%", "100%"]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 bg-[#04040a]/60 py-32 px-6 overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

      {/* ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="text-center mb-20"
        >
          <p className="font-mono text-xs text-indigo-400/70 tracking-[0.25em] uppercase mb-4">
            Journey
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-black text-slate-100">
            The{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-violet-400 bg-clip-text text-transparent">
              path so far
            </span>
          </h2>
        </motion.div>

        {/* timeline container */}
        <div className="relative">
          {/* vertical line - scroll-driven fill */}
          <div
            ref={lineRef}
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-slate-800/80"
          >
            <motion.div
              style={{ height: lineHeight }}
              className="w-full bg-gradient-to-b from-indigo-500 via-sky-500 to-violet-500 origin-top"
            />
          </div>

          {/* events */}
          <div className="relative flex flex-col gap-10 py-4">
            {EVENTS.map((event, i) => (
              <TimelineNode
                key={event.year + event.org}
                event={event}
                index={i}
                inView={inView}
                isLeft={i % 2 === 0}
              />
            ))}
          </div>

          {/* bottom cap */}
          <motion.div
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.8 }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gradient-to-br from-indigo-400 to-violet-400 ring-4 ring-indigo-400/20"
          />
        </div>

        {/* legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-8 mt-16"
        >
          {[
            { dot: "bg-sky-400",    label: "Education / Research" },
            { dot: "bg-violet-400", label: "Industry"    },
            { dot: "bg-emerald-400",label: "Milestone"   },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${item.dot}`} />
              <span className="text-slate-500 text-xs font-mono">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
