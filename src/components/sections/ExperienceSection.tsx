"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const EXPERIENCE = [
  {
    company: "Stripe",
    role: "AI / ML Engineer",
    period: "Jul 2025 - Present",
    location: "New York, NY",
    featured: true,
    description:
      "Building production multi-agent AI systems for real-time financial fraud detection across Stripe's payment infrastructure - owning the full ML lifecycle from training to inference optimization to serving.",
    highlights: [
      "Architected a multi-agent LangGraph system for real-time fraud triage across 70M+ daily transactions; reduced false-positive review rate by 22% and cut analyst escalation time by 35%",
      "Engineered production ML pipeline on SageMaker + EKS with ONNX INT8 quantization; achieved sub-150ms p95 latency for 10K+ concurrent requests - 3x throughput over baseline",
      "Built Feast feature store integration for real-time fraud signal aggregation; eliminated 40% of train-serve skew incidents",
      "Deployed ReAct-based agentic AI with Claude function calling for autonomous dispute classification; 10K+ cases/day at 89% routing accuracy, reduced manual review load by 28%",
      "Scaled EKS infrastructure with horizontal pod auto-scaling and multi-AZ failover; sustained 99.9% SLA during 8x peak traffic surges with zero-downtime rolling deployments",
    ],
    stack: ["LangGraph", "PyTorch", "ONNX", "Feast", "SageMaker", "EKS", "Claude API", "Pydantic"],
    logo: "S",
    color: "from-indigo-500 to-sky-500",
  },
  {
    company: "Binghamton University",
    role: "Graduate Research Assistant",
    period: "Aug 2024 - May 2025",
    location: "Binghamton, NY",
    featured: false,
    highlights: [
      "Fine-tuned FinBERT on 3,000+ Russell 3000 earnings call transcripts; achieved 14% F1 improvement over base model for risk-sentiment classification, tracked with MLflow",
      "Engineered end-to-end NLP pipeline (tokenization, ChromaDB vector indexing, inference serving); reduced text-processing overhead by 25%, enabling sub-100ms semantic retrieval over 100K+ document chunks",
      "Designed LangGraph agentic summarization system with persistent memory and tool-calling for real-time SEC filing retrieval; reduced analyst review time by 30%",
      "Conducted SHAP attribution and counterfactual bias auditing; surfaced 3 systematic attribution errors and improved model fairness scores by 12% on held-out evaluation sets",
    ],
    stack: ["PyTorch", "FinBERT", "LangGraph", "ChromaDB", "SHAP", "MLflow", "HuggingFace"],
    logo: "B",
    color: "from-sky-400 to-indigo-500",
  },
  {
    company: "Cognizant",
    role: "ML Engineer",
    period: "Jul 2021 - Jun 2023",
    location: "Hyderabad, India",
    featured: false,
    highlights: [
      "Deployed XGBoost + LSTM ensemble credit default models on 10M+ customers via AWS SageMaker; delivered 8% AUC-ROC improvement over legacy rule-based system",
      "Architected PySpark feature engineering pipelines on AWS EMR with Feast integration; cut data processing time by 20% and enabled near real-time risk scoring",
      "Applied ONNX model export to production credit scoring endpoints; reduced inference latency by 30% on EC2 with no accuracy degradation",
      "Integrated SageMaker CI/CD pipelines with automated drift monitoring and auto-retraining triggers; maintained 99.8% uptime across 3 live models",
    ],
    stack: ["Python", "XGBoost", "PyTorch", "AWS SageMaker", "PySpark", "Feast", "ONNX", "MLflow"],
    logo: "C",
    color: "from-sky-500 to-violet-500",
  },
];

export default function ExperienceSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="experience" ref={ref} className="relative z-10 bg-[#04040a]/60 py-32 px-6">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-xs text-indigo-400/70 tracking-[0.25em] uppercase mb-4">
            Career
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-black text-slate-100">
            Where I&apos;ve{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">
              built things
            </span>
          </h2>
        </motion.div>

        <div className="space-y-6">
          {EXPERIENCE.map((job, i) => (
            <motion.div
              key={job.company}
              initial={{ opacity: 0, x: -32 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ type: "spring", stiffness: 80, damping: 20, delay: i * 0.15 }}
            >
              {job.featured ? (
                // ── Featured Stripe card ───────────────────────────────────
                <div className="relative rounded-2xl border border-indigo-500/30 bg-slate-900/20 overflow-hidden group">
                  {/* top gradient bar */}
                  <div className={`h-px bg-gradient-to-r ${job.color}`} />
                  {/* corner glow */}
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="p-8">
                    <div className="flex items-start gap-5 mb-6">
                      {/* logo */}
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${job.color} flex items-center justify-center text-white font-display font-black text-xl shrink-0`}>
                        {job.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-display text-xl font-bold text-slate-100">{job.company}</span>
                          <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
                            Current
                          </span>
                        </div>
                        <div className="text-sky-400 font-semibold">{job.role}</div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-slate-500 text-sm font-mono">{job.period}</span>
                          <span className="text-slate-700">·</span>
                          <span className="text-slate-500 text-sm">{job.location}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-slate-400 text-sm leading-relaxed mb-5">{job.description}</p>

                    <ul className="space-y-2 mb-5">
                      {job.highlights.map((h) => (
                        <li key={h} className="flex gap-3 text-sm text-slate-400">
                          <span className="text-indigo-400 shrink-0 mt-0.5">▸</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-2">
                      {job.stack.map((t) => (
                        <span key={t} className="font-mono text-xs px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/40">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // ── Timeline row ───────────────────────────────────────────
                <div className="relative pl-8 border-l border-slate-800">
                  <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-slate-700 border-2 border-slate-900" />
                  <div className="rounded-xl border border-slate-800/60 bg-slate-900/20 p-6">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <span className="font-display text-lg font-bold text-slate-100">{job.company}</span>
                      <span className="text-slate-400 font-medium">{job.role}</span>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-slate-500 text-sm font-mono">{job.period}</span>
                      <span className="text-slate-700">·</span>
                      <span className="text-slate-500 text-sm">{job.location}</span>
                    </div>
                    <ul className="space-y-1.5">
                      {job.highlights.map((h) => (
                        <li key={h} className="flex gap-3 text-sm text-slate-500">
                          <span className="text-slate-600 shrink-0">▸</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
