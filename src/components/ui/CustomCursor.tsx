"use client";

/**
 * Neural Pulse Cursor
 *
 * Default   — 6px glowing dot + single ring that breathes (scale pulse)
 * Hover     — dot brightens, ring splits into 3 dashed rings orbiting at
 *             different speeds and directions (CW / CCW / CW)
 * Click     — two concentric shockwave rings burst outward from the exact
 *             click position and fade away
 */

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

interface Wave {
  id: number;
  x: number;
  y: number;
}

export default function CustomCursor() {
  const [visible,  setVisible]  = useState(false);
  const [hidden,   setHidden]   = useState(false);
  const [hovering, setHovering] = useState(false);
  const [waves,    setWaves]    = useState<Wave[]>([]);
  const waveId = useRef(0);

  // Dot tracks mouse exactly
  const dotX = useMotionValue(-200);
  const dotY = useMotionValue(-200);

  // Ring center springs behind the dot
  const ringX = useSpring(dotX, { stiffness: 160, damping: 18, mass: 0.35 });
  const ringY = useSpring(dotY, { stiffness: 160, damping: 18, mass: 0.35 });

  useEffect(() => {
    // Skip on touch-only devices
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return;

    const move = (e: MouseEvent) => {
      const overManny = !!(e.target as Element).closest(".ask-manny-zone");
      setHidden(overManny);
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const over = (e: MouseEvent) => {
      if ((e.target as Element).closest("a, button, [data-cursor='hover'], label")) {
        setHovering(true);
      }
    };

    const out = (e: MouseEvent) => {
      if ((e.target as Element).closest("a, button, [data-cursor='hover'], label")) {
        setHovering(false);
      }
    };

    const click = (e: MouseEvent) => {
      const id = ++waveId.current;
      setWaves((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
      // Clean up after animation finishes
      setTimeout(() => setWaves((prev) => prev.filter((w) => w.id !== id)), 900);
    };

    const leave  = () => setVisible(false);
    const enter  = () => setVisible(true);

    window.addEventListener("mousemove",  move);
    window.addEventListener("mouseover",  over);
    window.addEventListener("mouseout",   out);
    window.addEventListener("click",      click);
    document.documentElement.addEventListener("mouseleave", leave);
    document.documentElement.addEventListener("mouseenter", enter);

    return () => {
      window.removeEventListener("mousemove",  move);
      window.removeEventListener("mouseover",  over);
      window.removeEventListener("mouseout",   out);
      window.removeEventListener("click",      click);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.removeEventListener("mouseenter", enter);
    };
  }, [dotX, dotY, visible]);

  return (
    <>
      {/* ── Center dot ────────────────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          opacity: (visible && !hidden) ? 1 : 0,
          scale:   hovering ? 1.6 : 1,
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        <div
          className="rounded-full"
          style={{
            width:     6,
            height:    6,
            background: hovering ? "#38bdf8" : "#818cf8",
            boxShadow:  hovering
              ? "0 0 14px #38bdf8, 0 0 28px rgba(56,189,248,0.5)"
              : "0 0 10px #818cf8, 0 0 20px rgba(129,140,248,0.4)",
            transition: "background 0.2s, box-shadow 0.2s",
          }}
        />
      </motion.div>

      {/* ── Ring container (spring-lagged) ───────────────── */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: (visible && !hidden) ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <AnimatePresence mode="wait">
          {hovering ? (
            /* ── HOVER: 3 orbiting dashed rings ── */
            <motion.div
              key="orbit"
              className="relative"
              style={{ width: 0, height: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Ring 1 — inner, CW, indigo */}
              <motion.div
                className="absolute"
                style={{ width: 28, height: 28, top: -14, left: -14 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
              >
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    border: "1.5px dashed #818cf8",
                    opacity: 0.95,
                    boxShadow: "0 0 6px rgba(129,140,248,0.4)",
                  }}
                />
              </motion.div>

              {/* Ring 2 — mid, CCW, sky */}
              <motion.div
                className="absolute"
                style={{ width: 46, height: 46, top: -23, left: -23 }}
                animate={{ rotate: -360 }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
              >
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    border: "1.5px dashed #38bdf8",
                    opacity: 0.75,
                    boxShadow: "0 0 6px rgba(56,189,248,0.3)",
                  }}
                />
              </motion.div>

              {/* Ring 3 — outer, CW slow, violet */}
              <motion.div
                className="absolute"
                style={{ width: 66, height: 66, top: -33, left: -33 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "linear" }}
              >
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    border: "1.5px dashed #a78bfa",
                    opacity: 0.5,
                    boxShadow: "0 0 6px rgba(167,139,250,0.2)",
                  }}
                />
              </motion.div>
            </motion.div>
          ) : (
            /* ── DEFAULT: single breathing ring ── */
            <motion.div
              key="breathe"
              className="absolute rounded-full"
              style={{
                width:     34,
                height:    34,
                top:       -17,
                left:      -17,
                border:    "1.5px solid #6366f1",
                boxShadow: "0 0 10px rgba(99,102,241,0.3)",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: [0.55, 0.85, 0.55],
                scale:   [1,    1.2,  1   ],
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                opacity: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
                scale:   { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
                exit:    { duration: 0.2 },
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Shockwaves (fired at exact click position) ───── */}
      <AnimatePresence>
        {waves.map((w) => (
          <motion.div key={w.id} className="fixed top-0 left-0 pointer-events-none z-[9997]">
            {/* Inner wave — faster */}
            <motion.div
              className="absolute rounded-full"
              style={{
                left:   w.x,
                top:    w.y,
                translateX: "-50%",
                translateY: "-50%",
                border: "1.5px solid #818cf8",
              }}
              initial={{ width: 8, height: 8, opacity: 0.9 }}
              animate={{ width: 90, height: 90, opacity: 0 }}
              exit={{}}
              transition={{ duration: 0.6, ease: [0.2, 0.8, 0.4, 1] }}
            />
            {/* Outer wave — slightly delayed, larger */}
            <motion.div
              className="absolute rounded-full"
              style={{
                left:   w.x,
                top:    w.y,
                translateX: "-50%",
                translateY: "-50%",
                border: "1px solid #38bdf8",
              }}
              initial={{ width: 8, height: 8, opacity: 0.6 }}
              animate={{ width: 130, height: 130, opacity: 0 }}
              exit={{}}
              transition={{ duration: 0.75, ease: [0.2, 0.8, 0.4, 1], delay: 0.08 }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  );
}
