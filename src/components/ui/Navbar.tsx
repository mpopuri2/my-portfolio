"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const NAV_LINKS = [
  { label: "Impact",     href: "#impact"     },
  { label: "Projects",   href: "#projects"   },
  { label: "Experience", href: "#experience" },
  { label: "Skills",     href: "#skills"     },
  { label: "Contact",    href: "#contact"    },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { scrollY } = useScroll();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Solid background after hero
  useEffect(() => {
    return scrollY.on("change", (v) => setScrolled(v > 60));
  }, [scrollY]);

  // Active section highlight
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.4 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#04040a]/90 backdrop-blur-xl border-b border-slate-800/60 shadow-2xl shadow-black/40"
          : "bg-transparent"
      }`}
    >
      {/* Scroll progress bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px] origin-left z-50"
        style={{
          scaleX,
          background: "linear-gradient(90deg, #6366f1, #38bdf8, #a78bfa)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo: full name */}
        <a href="#" className="group flex items-center gap-3">
          <motion.span
            animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.2, 1] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8] shrink-0"
          />
          <span className="font-display font-bold text-[15px] tracking-tight text-slate-100 group-hover:text-white transition-colors duration-200">
            Manjunath{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">
              Popuri
            </span>
          </span>
        </a>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.replace("#", "");
            return (
              <a
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-lg font-mono text-[12px] tracking-wide transition-colors duration-200 ${
                  isActive
                    ? "text-sky-400"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg bg-sky-500/10 border border-sky-500/20"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative">{link.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Resume CTA */}
        <motion.a
          href="/Manjunath_Popuri.pdf"
          download="Manjunath_Popuri_Resume.pdf"
          whileHover={{ scale: 1.04, y: -1 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg
                     border border-indigo-500/30 hover:bg-indigo-500/10
                     text-indigo-300 hover:text-indigo-200
                     font-mono text-[11px] tracking-wider uppercase
                     transition-colors duration-200"
        >
          Resume ↓
        </motion.a>
      </div>
    </motion.header>
  );
}
