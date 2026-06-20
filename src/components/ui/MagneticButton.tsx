"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useSpring } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  download?: string;
  target?: string;
  onClick?: () => void;
  strength?: number; // 0-1, how strong the pull is (default 0.35)
  radius?: number;   // px radius of magnetic field (default 80)
}

export default function MagneticButton({
  children,
  className = "",
  href,
  download,
  target,
  onClick,
  strength = 0.35,
  radius = 80,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInField, setIsInField] = useState(false);

  const x = useSpring(0, { stiffness: 200, damping: 22, mass: 0.5 });
  const y = useSpring(0, { stiffness: 200, damping: 22, mass: 0.5 });

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);

      if (dist < radius) {
        setIsInField(true);
        x.set(dx * strength);
        y.set(dy * strength);
      } else {
        setIsInField(false);
        x.set(0);
        y.set(0);
      }
    },
    [radius, strength, x, y]
  );

  const onMouseLeave = useCallback(() => {
    setIsInField(false);
    x.set(0);
    y.set(0);
  }, [x, y]);

  const inner = (
    <motion.div
      style={{ x, y, display: "inline-flex" }}
      whileTap={{ scale: 0.96 }}
    >
      {href ? (
        <a
          href={href}
          download={download}
          target={target}
          className={className}
          onClick={onClick}
        >
          {children}
        </a>
      ) : (
        <button className={className} onClick={onClick}>
          {children}
        </button>
      )}
    </motion.div>
  );

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ display: "inline-flex" }}
    >
      {inner}
    </div>
  );
}
