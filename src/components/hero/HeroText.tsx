"use client";

/**
 * HeroText
 * Two-column layout: text (left) + circular photo (right) on md+.
 * Spring-physics entrance sequence with scroll-linked exit.
 */

import { motion, type MotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import MagneticButton from "@/components/ui/MagneticButton";

// ── Spring presets ────────────────────────────────────────────────────────────
const softSpring = { type: "spring" as const, stiffness: 72, damping: 18 };
const crispSpring = { type: "spring" as const, stiffness: 110, damping: 22 };

// ── Stagger variants ──────────────────────────────────────────────────────────
function makeVariant(yOffset: number, xOffset = 0) {
  return {
    hidden: { opacity: 0, y: yOffset, x: xOffset },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      x: 0,
      transition: { ...softSpring, delay },
    }),
  };
}

const slideUp    = makeVariant(36);
const slideLeft  = makeVariant(0, -40);
const slideRight = makeVariant(0, 40);
const fadeUp     = makeVariant(20);

// ── Metrics data ──────────────────────────────────────────────────────────────
const METRICS = [
  { num: "70M+",   label: "Daily Transactions" },
  { num: "22%",    label: "FP Rate Cut"        },
  { num: "<150ms", label: "p95 Latency"        },
  { num: "99.9%",  label: "SLA Compliance"     },
] as const;

// ── Component ─────────────────────────────────────────────────────────────────

interface HeroTextProps {
  scrollYProgress: MotionValue<number>;
}

export default function HeroText({ scrollYProgress }: HeroTextProps) {
  // Scroll-linked exit
  const opacity = useTransform(scrollYProgress, [0, 0.38], [1, 0]);
  const y       = useTransform(scrollYProgress, [0, 0.5], ["0%", "-8%"]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="relative z-10 w-full max-w-6xl mx-auto px-6 select-none"
    >
      {/* Two-column on md+, stacked on mobile */}
      <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">

        {/* ── Left column: all text ── */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1 min-w-0">

          {/* Eyebrow */}
          <motion.div
            custom={0.08}
            initial="hidden"
            animate="visible"
            variants={slideUp}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full
                       border border-sky-500/20 bg-sky-500/5
                       font-mono text-[11px] text-sky-400 tracking-[0.12em] uppercase
                       mb-10 backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
            AI/ML Engineer &nbsp;·&nbsp; Stripe &nbsp;·&nbsp; New York, NY
          </motion.div>

          {/* Main title */}
          <div className="mb-7 overflow-hidden">
            <motion.span
              custom={0.22}
              initial="hidden"
              animate="visible"
              variants={slideLeft}
              className="block font-display font-bold tracking-[-0.045em] leading-[1.0]
                         text-[clamp(40px,6vw,88px)] text-slate-100"
            >
              Engineering
            </motion.span>
            <motion.span
              custom={0.38}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="block font-display font-bold tracking-[-0.045em] leading-[1.0]
                         text-[clamp(40px,6vw,88px)]
                         bg-gradient-to-r from-electric via-sky-400 to-violet-400
                         bg-clip-text text-transparent"
            >
              Intelligent Systems
            </motion.span>
            <motion.span
              custom={0.54}
              initial="hidden"
              animate="visible"
              variants={slideRight}
              className="block font-display font-bold tracking-[-0.045em] leading-[1.0]
                         text-[clamp(40px,6vw,88px)] text-slate-100"
            >
              at Scale
            </motion.span>
          </div>

          {/* Sub-copy */}
          <motion.p
            custom={0.7}
            initial="hidden"
            animate="visible"
            variants={slideUp}
            className="max-w-lg text-slate-400 text-base md:text-[17px] leading-[1.75] font-light mb-11"
          >
            Building{" "}
            <strong className="font-medium text-slate-200">
              multi-agent LangGraph orchestration systems
            </strong>{" "}
            that process{" "}
            <strong className="font-medium text-sky-300">70M+ daily transactions</strong>{" "}
            at Stripe. MS CS (AI) · Binghamton University.
          </motion.p>

          {/* CTAs */}
          <motion.div
            custom={0.84}
            initial="hidden"
            animate="visible"
            variants={slideUp}
            className="flex items-center justify-center md:justify-start gap-3 flex-wrap mb-14"
          >
            <MagneticButton
              href="#projects"
              strength={0.38}
              radius={90}
              className="inline-flex items-center gap-2.5 px-7 py-3.5
                         bg-electric hover:bg-electric-dark text-white
                         font-semibold text-sm rounded-xl
                         shadow-[0_0_24px_rgba(99,102,241,0.35)]
                         hover:shadow-[0_4px_32px_rgba(99,102,241,0.5)]
                         transition-shadow duration-300"
            >
              View My Work
              <span className="text-base">↗</span>
            </MagneticButton>

            <MagneticButton
              href="/Manjunath_Popuri.pdf"
              download="Manjunath_Popuri_Resume.pdf"
              strength={0.3}
              radius={80}
              className="inline-flex items-center gap-2.5 px-6 py-3.5
                         border border-slate-700 hover:border-electric/60
                         text-slate-300 hover:text-electric
                         font-medium text-sm rounded-xl
                         transition-colors duration-200 backdrop-blur-sm"
            >
              Download Resume
            </MagneticButton>

            <MagneticButton
              href="https://linkedin.com/in/manjunathpopuri"
              target="_blank"
              strength={0.3}
              radius={80}
              className="inline-flex items-center gap-2.5 px-6 py-3.5
                         border border-slate-700 hover:border-sky-500/50
                         text-slate-300 hover:text-sky-400
                         font-medium text-sm rounded-xl
                         transition-colors duration-200 backdrop-blur-sm"
            >
              LinkedIn ↗
            </MagneticButton>
          </motion.div>

          {/* Impact metrics bar */}
          <motion.div
            custom={0.98}
            initial="hidden"
            animate="visible"
            variants={slideUp}
            className="flex items-center justify-center md:justify-start gap-0 flex-wrap
                       border border-slate-800/60 rounded-2xl
                       bg-slate-900/20 backdrop-blur-sm
                       divide-x divide-slate-800/60 overflow-hidden"
          >
            {METRICS.map(({ num, label }) => (
              <div key={label} className="flex flex-col items-center px-5 py-4 gap-0.5">
                <span className="font-display font-bold text-[20px] text-sky-300 leading-none tracking-tight">
                  {num}
                </span>
                <span className="font-mono text-[10px] text-slate-500 tracking-widest uppercase">
                  {label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Right column: photo ── */}
        <motion.div
          custom={0.3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative flex-shrink-0 hidden md:flex items-center justify-center pb-20"
        >
          {/* Ambient glow behind photo */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-600/30 via-sky-500/15 to-violet-600/25 blur-3xl scale-[1.7] pointer-events-none" />

          {/* Outer slow-spinning dashed ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            className="absolute w-[310px] h-[310px] rounded-full"
            style={{
              border: "1px dashed rgba(99,102,241,0.22)",
            }}
          />

          {/* Inner counter-rotating ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute w-[280px] h-[280px] rounded-full"
            style={{
              border: "1px dashed rgba(139,92,246,0.15)",
            }}
          />

          {/* Photo with gradient border */}
          <div
            className="relative w-60 h-60 rounded-full p-[2px]"
            style={{
              background: "linear-gradient(135deg, #818cf8, #38bdf8, #a78bfa)",
              boxShadow: "0 0 64px rgba(99,102,241,0.35), 0 0 24px rgba(56,189,248,0.2)",
            }}
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-[#04040a]">
              <Image
                src="/my_image.jpeg"
                alt="Manjunath Popuri - AI/ML Engineer at Stripe"
                width={240}
                height={240}
                className="w-full h-full object-cover object-top"
                priority
              />
            </div>
          </div>

          {/* Floating "Available" badge */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-1 -right-6 flex items-center gap-2 px-3.5 py-2 rounded-xl
                       bg-slate-900/90 border border-slate-700/60 backdrop-blur-sm
                       shadow-2xl shadow-black/50"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
            <span className="font-mono text-[10px] text-slate-300 whitespace-nowrap">Open to roles</span>
          </motion.div>

          {/* Name + role below photo */}
          <motion.div
            custom={0.5}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center whitespace-nowrap"
          >
            <p className="font-display font-bold text-[17px] tracking-tight">
              <span className="text-slate-100">Manjunath </span>
              <span className="bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">
                Popuri
              </span>
            </p>
            <p className="font-mono text-[10px] text-slate-500 tracking-[0.15em] uppercase mt-0.5">
              AI / ML Engineer
            </p>
          </motion.div>

          {/* "Stripe" badge - top left of photo */}
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
            className="absolute -top-2 -left-8 flex items-center gap-2 px-3 py-1.5 rounded-lg
                       bg-slate-900/90 border border-indigo-500/30 backdrop-blur-sm
                       shadow-xl shadow-black/40"
          >
            <span className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center text-white font-black text-[9px]">S</span>
            <span className="font-mono text-[10px] text-indigo-300">AI/ML · Stripe</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        custom={1.14}
        initial="hidden"
        animate="visible"
        variants={slideUp}
        className="absolute -bottom-20 left-1/2 -translate-x-1/2
                   flex flex-col items-center gap-2.5 pointer-events-none"
      >
        <span className="font-mono text-[9px] text-slate-600 tracking-[0.2em] uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-12 bg-gradient-to-b from-slate-600/70 to-transparent"
        />
      </motion.div>
    </motion.div>
  );
}
