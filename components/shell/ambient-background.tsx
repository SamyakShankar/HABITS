"use client";

import { useMemo } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

export function AmbientBackground() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const drift = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : -80]);
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => ({
        id: index,
        left: `${(index * 23) % 100}%`,
        top: `${(index * 37) % 100}%`,
        delay: (index % 7) * 0.45,
        size: 2 + (index % 4)
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-radial-grid cyber-grid">
      <motion.div className="absolute inset-0 circuit-line opacity-50" style={{ y: drift }} />
      <motion.div
        className="absolute left-1/2 top-0 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-pulse/20 blur-[120px]"
        animate={prefersReducedMotion ? undefined : { opacity: [0.55, 0.9, 0.55], scale: [1, 1.04, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute bottom-0 left-8 h-[28rem] w-[28rem] rounded-full bg-cyan/10 blur-[120px]" />
      <div className="absolute bottom-10 right-6 h-[26rem] w-[26rem] rounded-full bg-danger/10 blur-[120px]" />
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-purple-200 shadow-neon"
          style={{
            left: particle.left,
            top: particle.top,
            height: particle.size,
            width: particle.size
          }}
          animate={prefersReducedMotion ? undefined : { y: [0, -28, 0], opacity: [0.1, 0.9, 0.1], scale: [1, 1.8, 1] }}
          transition={{ duration: 5 + (particle.id % 4), repeat: Infinity, delay: particle.delay }}
        />
      ))}
      <div className="noise" />
      <div className="scanline" />
    </div>
  );
}
