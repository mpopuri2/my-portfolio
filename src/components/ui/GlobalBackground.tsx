"use client";

/**
 * GlobalBackground
 * Fixed layer that lives behind every section.
 * Three slow-drifting radial gradient orbs give the page a living, breathing
 * quality — like the neural network is still running beneath all the content.
 */

import { motion } from "framer-motion";

const ORBS = [
  {
    id: "orb-indigo",
    // Top-left quadrant - indigo
    initial: { x: "-10%", y: "5%" },
    animate: { x: ["-10%", "5%", "-5%", "-10%"], y: ["5%", "18%", "8%", "5%"] },
    duration: 28,
    color: "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(99,102,241,0.12) 0%, transparent 70%)",
    size: "w-[900px] h-[700px]",
  },
  {
    id: "orb-sky",
    // Center-right - sky blue
    initial: { x: "60%", y: "35%" },
    animate: { x: ["60%", "72%", "58%", "60%"], y: ["35%", "25%", "45%", "35%"] },
    duration: 34,
    color: "radial-gradient(ellipse 55% 60% at 50% 50%, rgba(14,165,233,0.09) 0%, transparent 70%)",
    size: "w-[800px] h-[800px]",
  },
  {
    id: "orb-violet",
    // Bottom-center - violet
    initial: { x: "30%", y: "70%" },
    animate: { x: ["30%", "20%", "40%", "30%"], y: ["70%", "80%", "65%", "70%"] },
    duration: 40,
    color: "radial-gradient(ellipse 65% 50% at 50% 50%, rgba(139,92,246,0.08) 0%, transparent 70%)",
    size: "w-[1000px] h-[600px]",
  },
];

// Subtle dot grid overlay
function DotGrid() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(148,163,184,0.055) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    />
  );
}

export default function GlobalBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Deep base color */}
      <div className="absolute inset-0 bg-[#04040a]" />

      {/* Dot grid */}
      <DotGrid />

      {/* Drifting gradient orbs */}
      {ORBS.map((orb) => (
        <motion.div
          key={orb.id}
          className={`absolute ${orb.size}`}
          initial={{ left: orb.initial.x, top: orb.initial.y }}
          animate={{
            left: orb.animate.x,
            top:  orb.animate.y,
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "mirror",
          }}
          style={{
            background: orb.color,
            transform: "translate(-50%, -50%)",
            willChange: "left, top",
          }}
        />
      ))}

      {/* Subtle vignette at edges to frame content */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 100% at 50% 50%, transparent 40%, rgba(4,4,10,0.7) 100%)",
        }}
      />

      {/* Film grain — SVG turbulence noise at low opacity */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
}
