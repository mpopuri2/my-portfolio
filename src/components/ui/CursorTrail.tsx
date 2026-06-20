"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  alpha: number;
  size: number;
  hue: number;
}

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia("(hover: none)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };

      // Only spawn if moved enough (avoids burst on slow movement)
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      if (Math.hypot(dx, dy) < 6) return;
      lastPos.current = { x: e.clientX, y: e.clientY };

      // Spawn 2-3 particles at cursor position
      const count = Math.floor(Math.random() * 2) + 2;
      for (let i = 0; i < count; i++) {
        particles.current.push({
          x:     e.clientX + (Math.random() - 0.5) * 6,
          y:     e.clientY + (Math.random() - 0.5) * 6,
          alpha: 0.55 + Math.random() * 0.25,
          size:  1.5 + Math.random() * 2.5,
          // Rotate between indigo (250), sky (200), violet (270)
          hue:   [250, 200, 270][Math.floor(Math.random() * 3)],
        });
      }

      // Cap at 80 particles
      if (particles.current.length > 80) {
        particles.current.splice(0, particles.current.length - 80);
      }
    };

    window.addEventListener("mousemove", onMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.alpha -= 0.022;

        if (p.alpha <= 0) {
          particles.current.splice(i, 1);
          continue;
        }

        // Glow effect: outer blur circle
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        grad.addColorStop(0, `hsla(${p.hue}, 80%, 70%, ${p.alpha})`);
        grad.addColorStop(1, `hsla(${p.hue}, 80%, 70%, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Bright core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 85%, ${p.alpha * 1.4})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9997] pointer-events-none"
      aria-hidden="true"
    />
  );
}
