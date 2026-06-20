"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Lightweight canvas confetti - no external lib needed
function launchConfetti() {
  const canvas = document.createElement("canvas");
  canvas.style.cssText =
    "position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;pointer-events:none";
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d")!;

  const EMOJIS = ["🤖", "🧠", "📊", "⚡", "🚀", "✨", "💡", "🎯", "🔥", "💎"];
  const COLORS  = ["#818cf8", "#38bdf8", "#a78bfa", "#34d399", "#f472b6", "#fbbf24"];

  interface Piece {
    x: number; y: number; vx: number; vy: number;
    size: number; color: string; emoji: string;
    rotation: number; rotSpeed: number; alpha: number;
    useEmoji: boolean;
  }

  const pieces: Piece[] = Array.from({ length: 90 }, (_, i) => ({
    x:        Math.random() * canvas.width,
    y:        -20 - Math.random() * 200,
    vx:       (Math.random() - 0.5) * 4,
    vy:       3 + Math.random() * 5,
    size:     i < 15 ? 20 : 6 + Math.random() * 6,
    color:    COLORS[Math.floor(Math.random() * COLORS.length)],
    emoji:    EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    rotation: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 8,
    alpha:    1,
    useEmoji: i < 15,
  }));

  let frame = 0;
  const MAX_FRAMES = 160;

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;

    for (const p of pieces) {
      p.x   += p.vx;
      p.y   += p.vy;
      p.vy  += 0.12;
      p.rotation += p.rotSpeed;
      if (frame > MAX_FRAMES * 0.6) p.alpha = Math.max(0, p.alpha - 0.025);

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);

      if (p.useEmoji) {
        ctx.font = `${p.size}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.emoji, 0, 0);
      } else {
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.4);
      }
      ctx.restore();
    }

    if (frame < MAX_FRAMES) {
      requestAnimationFrame(animate);
    } else {
      document.body.removeChild(canvas);
    }
  };

  requestAnimationFrame(animate);
}

export default function HireMeTrigger() {
  const [show, setShow] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const buffer = useRef("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Show hint when user reaches the bottom of the page
  useEffect(() => {
    const onScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 80;
      setShowHint(nearBottom);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Skip if user is typing in an input/textarea
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      buffer.current = (buffer.current + e.key.toLowerCase()).slice(-6);

      // Reset buffer after 2s of inactivity
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => { buffer.current = ""; }, 2000);

      if (buffer.current.includes("hire")) {
        buffer.current = "";
        launchConfetti();
        setShow(true);
        setTimeout(() => setShow(false), 4500);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="hire-toast"
          initial={{ opacity: 0, y: 40, scale: 0.85 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          exit={{   opacity: 0, y: -20, scale: 0.9  }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                     z-[99998] flex flex-col items-center gap-3 text-center
                     px-10 py-8 rounded-3xl
                     bg-slate-900/95 border border-indigo-500/40
                     shadow-2xl shadow-indigo-900/60 backdrop-blur-xl"
        >
          <motion.span
            animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl"
          >
            🧠
          </motion.span>
          <p className="font-display font-bold text-2xl text-slate-100">
            Great taste!
          </p>
          <p className="font-mono text-sm text-indigo-300">
            Let&apos;s build something brilliant together.
          </p>
          <a
            href="mailto:manjunathpopuri2@gmail.com"
            className="mt-1 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500
                       text-white font-semibold text-sm transition-colors duration-200"
          >
            Send me a message ↗
          </a>
        </motion.div>
      )}
      {showHint && (
        <motion.div
          key="keyboard-hint"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9960]
                     flex items-center gap-2 px-4 py-2 rounded-full
                     bg-slate-900/80 border border-slate-700/50 backdrop-blur-md
                     pointer-events-none select-none"
        >
          <span className="text-base">💡</span>
          <span className="font-mono text-[11px] text-slate-400 tracking-widest uppercase">
            type&nbsp;
          </span>
          <span className="font-mono text-[11px] text-indigo-400 tracking-widest uppercase font-bold">
            hire
          </span>
          <span className="font-mono text-[11px] text-slate-400 tracking-widest uppercase">
            &nbsp;on your keyboard
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
