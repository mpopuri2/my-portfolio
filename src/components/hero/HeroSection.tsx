"use client";

/**
 * HeroSection
 * Orchestrates the 3D canvas + text overlay.
 *
 * Scroll behaviour:
 *   • The R3F Canvas is position:fixed - it renders behind all page content.
 *   • As the hero viewport scrolls out, Framer Motion spring-transforms the
 *     canvas: opacity 1→0.12, scale 1→0.88 - the neural network "retreats"
 *     to become an ambient background for the rest of the page.
 *   • HeroText.tsx handles the text exit independently (lifted + faded).
 */

import { useRef } from "react";
import dynamic from "next/dynamic";
import {
  useScroll,
  useTransform,
  useSpring,
  motion,
} from "framer-motion";
import HeroText from "./HeroText";

// Dynamic import prevents R3F from running on the server
const NeuralCanvas = dynamic(() => import("./NeuralCanvas"), {
  ssr: false,
  loading: () => null,
});

// ─── Spring config - "heavy" feel ────────────────────────────────────────────
const CANVAS_SPRING = { stiffness: 48, damping: 18, mass: 1.2 } as const;
const OPACITY_SPRING = { stiffness: 60, damping: 22 } as const;

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Track scroll through the hero section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Raw transforms
  const rawScale = useTransform(scrollYProgress, [0, 1], [1, 0.88]);
  const rawOpacity = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    [0.92, 0.45, 0.28]
  );

  // Spring-ify so the canvas feels like it has mass and drag
  const canvasScale = useSpring(rawScale, CANVAS_SPRING);
  const canvasOpacity = useSpring(rawOpacity, OPACITY_SPRING);

  return (
    <>
      {/* ── Fixed 3D canvas - persists as ambient background ── */}
      <motion.div
        style={{
          scale: canvasScale,
          opacity: canvasOpacity,
        }}
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      >
        <NeuralCanvas />
      </motion.div>

      {/* ── Hero viewport ── */}
      <section
        id="hero"
        ref={sectionRef}
        className="relative z-10 min-h-screen flex items-center justify-center
                   overflow-hidden"
      >
        {/* Radial vignette - deepens background at edges */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, #04040a 100%)",
          }}
          aria-hidden="true"
        />

        {/* Text content - exits on scroll (handled inside HeroText) */}
        <HeroText scrollYProgress={scrollYProgress} />
      </section>
    </>
  );
}
