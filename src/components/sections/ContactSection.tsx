"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const LINKS = [
  {
    label: "LinkedIn",
    value: "linkedin.com/in/manjunathpopuri",
    href: "https://www.linkedin.com/in/manjunathpopuri",
    icon: "in",
    accent: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/25",
    hoverBorder: "hover:border-sky-500/50",
    primary: true,
  },
  {
    label: "GitHub",
    value: "github.com/mpopuri2",
    href: "https://github.com/mpopuri2",
    icon: "gh",
    accent: "text-slate-300",
    bg: "bg-slate-700/20",
    border: "border-slate-700/40",
    hoverBorder: "hover:border-slate-600/60",
    primary: false,
  },
  {
    label: "Email",
    value: "manjunathpopuri2@gmail.com",
    href: "mailto:manjunathpopuri2@gmail.com",
    icon: "@",
    accent: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/25",
    hoverBorder: "hover:border-indigo-500/50",
    primary: false,
  },
];

export default function ContactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section id="contact" ref={ref} className="relative z-10 bg-[#04040a]/60 py-32 px-6">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

      {/* bottom fade to avoid hard edge */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#04040a] to-transparent pointer-events-none" />

      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        >
          <p className="font-mono text-xs text-indigo-400/70 tracking-[0.25em] uppercase mb-4">
            Get in touch
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-black text-slate-100 mb-4">
            Let&apos;s{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-violet-400 bg-clip-text text-transparent">
              build together
            </span>
          </h2>
          <p className="text-slate-400 text-base leading-relaxed mb-12 max-w-lg mx-auto">
            Open to senior AI/ML engineering roles, applied science positions, and research
            collaborations at the intersection of LLMs and production systems.
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {LINKS.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: i * 0.1 }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={`group flex items-center gap-3 px-6 py-3.5 rounded-xl border ${link.border} ${link.hoverBorder} ${link.bg} transition-all duration-200 ${link.primary ? "sm:flex-1" : ""}`}
            >
              <span className={`font-mono text-sm font-bold ${link.accent} w-7 h-7 rounded-lg bg-current/10 flex items-center justify-center shrink-0`}>
                <span className={link.accent}>{link.icon}</span>
              </span>
              <div className="text-left min-w-0">
                <div className={`text-xs font-mono ${link.accent} uppercase tracking-wider`}>{link.label}</div>
                <div className="text-slate-400 text-xs truncate">{link.value}</div>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="font-mono text-xs text-slate-700 mt-16"
        >
          © 2026 Manjunath Popuri · Built with Next.js 15, React Three Fiber, Framer Motion
        </motion.p>
      </div>
    </section>
  );
}
