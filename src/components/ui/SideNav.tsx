"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SECTIONS = [
  { id: "hero",       label: "Home"       },
  { id: "impact",     label: "Impact"     },
  { id: "projects",   label: "Projects"   },
  { id: "experience", label: "Experience" },
  { id: "skills",     label: "Skills"     },
  { id: "contact",    label: "Contact"    },
];

export default function SideNav() {
  const [active,  setActive]  = useState("hero");
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show after hero scrolls past
    const onScroll = () => setVisible(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-4"
          aria-label="Section navigation"
        >
          {SECTIONS.map(({ id, label }) => {
            const isActive = active === id;
            return (
              <div key={id} className="relative flex items-center justify-end group">
                {/* Tooltip */}
                <AnimatePresence>
                  {tooltip === id && (
                    <motion.div
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-8 whitespace-nowrap px-2.5 py-1 rounded-lg
                                 bg-slate-900/90 border border-slate-700/60 backdrop-blur-sm
                                 font-mono text-[10px] text-slate-300 pointer-events-none"
                    >
                      {label}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Dot */}
                <button
                  onClick={() => scrollTo(id)}
                  onMouseEnter={() => setTooltip(id)}
                  onMouseLeave={() => setTooltip(null)}
                  aria-label={`Go to ${label}`}
                  className="relative flex items-center justify-center w-6 h-6 cursor-none"
                >
                  {/* Outer glow ring — only on active */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-glow"
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "rgba(99,102,241,0.15)",
                        boxShadow:  "0 0 10px rgba(99,102,241,0.4)",
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    />
                  )}
                  {/* Dot core */}
                  <motion.div
                    className="rounded-full"
                    animate={{
                      width:      isActive ? 10 : 5,
                      height:     isActive ? 10 : 5,
                      background: isActive
                        ? "linear-gradient(135deg,#818cf8,#38bdf8)"
                        : "#334155",
                      boxShadow:  isActive
                        ? "0 0 12px rgba(129,140,248,0.8)"
                        : "none",
                    }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  />
                </button>
              </div>
            );
          })}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
