"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { springTransition } from "@/lib/motion";

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "text-pulse",
  className
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: string;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.015 }}
      whileTap={{ scale: 0.99 }}
      transition={springTransition}
      className={cn("holo-border premium-hover rounded-lg bg-black/30 p-4", className)}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p>
        <Icon className={cn("h-5 w-5", accent)} />
      </div>
      <p className="mt-3 font-display text-2xl font-black text-white">{value}</p>
    </motion.div>
  );
}
