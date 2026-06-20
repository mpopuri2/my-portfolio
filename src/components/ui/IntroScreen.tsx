"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAME  = "Manjunath Popuri";
const ROLE  = "AI / ML Engineer";

type Phase = "typing" | "role" | "exiting" | "done";

export default function IntroScreen() {
  const [show,  setShow]  = useState(false);
  const [phase, setPhase] = useState<Phase>("typing");
  const [typed, setTyped] = useState("");

  // Show only once per browser session
  useEffect(() => {
    try {
      if (sessionStorage.getItem("intro-seen")) return;
      sessionStorage.setItem("intro-seen", "1");
    } catch {
      return; // SSR / private mode — skip gracefully
    }
    setShow(true);
  }, []);

  // Typewriter
  useEffect(() => {
    if (!show) return;

    let i = 0;
    const tick = setInterval(() => {
      i += 1;
      setTyped(NAME.slice(0, i));
      if (i >= NAME.length) {
        clearInterval(tick);
        setTimeout(() => setPhase("role"),    250);
        setTimeout(() => setPhase("exiting"), 1350);
        setTimeout(() => setPhase("done"),    2100);
      }
    }, 55);

    return () => clearInterval(tick);
  }, [show]);

  if (!show || phase === "done") return null;

  return (
    <AnimatePresence>
      <motion.div
        key="intro"
        className="fixed inset-0 z-[9990] flex flex-col items-center justify-center overflow-hidden"
        style={{ background: "#04040a" }}
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.03 }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(148,163,184,0.9) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Ambient glow */}
        <motion.div
          className="absolute w-[700px] h-[500px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Text block */}
        <div className="relative text-center px-8">
          {/* Eyebrow */}
          <motion.p
            className="font-mono text-[11px] text-indigo-400/60 tracking-[0.3em] uppercase mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Portfolio
          </motion.p>

          {/* Name typewriter */}
          <h1 className="font-display font-bold tracking-tight text-slate-100"
            style={{ fontSize: "clamp(32px, 6vw, 72px)", minHeight: "1.15em" }}
          >
            <span className="bg-gradient-to-r from-slate-100 via-indigo-200 to-slate-100 bg-clip-text text-transparent">
              {typed}
            </span>
            {/* Blinking cursor */}
            {phase === "typing" && (
              <motion.span
                className="inline-block bg-indigo-400 ml-1 align-middle"
                style={{ width: 3, height: "0.8em" }}
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
              />
            )}
          </h1>

          {/* Role */}
          <motion.p
            className="font-mono text-sm tracking-[0.25em] uppercase mt-4"
            style={{ color: "#818cf8" }}
            initial={{ opacity: 0, y: 10 }}
            animate={
              phase === "role" || phase === "exiting"
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 10 }
            }
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {ROLE}
          </motion.p>
        </div>

        {/* Progress line at bottom */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px]"
          style={{
            background: "linear-gradient(90deg, #6366f1, #38bdf8, #a78bfa)",
          }}
          initial={{ width: "0%" }}
          animate={
            phase === "exiting"
              ? { width: "100%" }
              : { width: `${(typed.length / NAME.length) * 55}%` }
          }
          transition={{
            duration: phase === "exiting" ? 0.55 : 0.1,
            ease: phase === "exiting" ? [0.76, 0, 0.24, 1] : "linear",
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
