"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function NYClock() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", {
        timeZone: "America/New_York",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }));
      setDate(now.toLocaleDateString("en-US", {
        timeZone: "America/New_York",
        weekday: "short",
        month: "short",
        day: "numeric",
      }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2.5, duration: 0.6, ease: "easeOut" }}
      className="fixed bottom-8 left-8 z-[9970] flex items-center gap-3
                 px-4 py-3 rounded-2xl
                 bg-slate-900/80 border border-slate-700/40
                 backdrop-blur-md shadow-xl shadow-black/40"
    >
      {/* Location + time */}
      <div className="flex flex-col gap-0.5">
        <span className="font-mono text-[9px] text-slate-500 tracking-[0.18em] uppercase">
          New York, NY
        </span>
        <span className="font-mono text-[15px] text-slate-100 tabular-nums leading-none tracking-tight">
          {time}
        </span>
        <span className="font-mono text-[9px] text-slate-500 tracking-wide">
          {date}
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-10 bg-slate-700/50" />

      {/* Status */}
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]"
          />
          <span className="font-mono text-[9px] text-emerald-400 tracking-wider uppercase">
            Available
          </span>
        </div>
        <span className="font-mono text-[11px] text-slate-300 font-medium">
          @ Stripe
        </span>
        <span className="font-mono text-[9px] text-slate-500">
          AI/ML Engineer
        </span>
      </div>
    </motion.div>
  );
}
