"use client";

import { Check, Edit3, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useHabitStore } from "@/store/habit-store";
import type { Habit } from "@/types";
import { cn } from "@/lib/utils";
import { springTransition } from "@/lib/motion";

export function HabitCard({ habit }: { habit: Habit }) {
  const toggleHabit = useHabitStore((state) => state.toggleHabit);
  const deleteHabit = useHabitStore((state) => state.deleteHabit);
  const Icon = habit.icon;
  const completedDays = habit.completionHistory.filter(Boolean).length;
  const progress = Math.round((completedDays / habit.completionHistory.length) * 100);

  return (
    <motion.article
      layout
      whileHover={{ y: -6, scale: 1.006 }}
      whileTap={{ scale: 0.995 }}
      transition={springTransition}
      className={cn(
        "premium-hover rounded-lg border bg-black/30 p-4",
        habit.completed ? "border-mint/50 shadow-[0_0_24px_rgba(66,255,186,.18)]" : "border-pulse/30"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border bg-black/40"
          style={{ borderColor: habit.color, boxShadow: `0 0 20px ${habit.color}55` }}
        >
          <Icon className="h-6 w-6" style={{ color: habit.color }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-sm font-black uppercase text-white">{habit.title}</h3>
            <Badge>{habit.difficulty}</Badge>
          </div>
          <p className="mt-1 text-xs text-slate-400">{habit.note}</p>
        </div>
        <Button
          variant={habit.completed ? "cyan" : "ghost"}
          size="icon"
          aria-label={`Toggle ${habit.title}`}
          onClick={() => toggleHabit(habit.id)}
        >
          <Check className="h-4 w-4" />
        </Button>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded border border-white/10 bg-white/[0.03] p-2">
          <p className="font-display text-lg font-black text-white">{habit.streak}</p>
          <span className="uppercase text-slate-400">Streak</span>
        </div>
        <div className="rounded border border-white/10 bg-white/[0.03] p-2">
          <p className="font-display text-lg font-black text-cyan">+{habit.xp}</p>
          <span className="uppercase text-slate-400">XP</span>
        </div>
        <div className="rounded border border-white/10 bg-white/[0.03] p-2">
          <p className="font-display text-lg font-black text-white">{habit.cadence}</p>
          <span className="uppercase text-slate-400">Cadence</span>
        </div>
      </div>
      <div className="mt-4">
        <div className="mb-2 flex justify-between text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
          <span>Completion History</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} />
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="dark" size="sm">
          <Edit3 className="h-3.5 w-3.5" />
          Edit
        </Button>
        <Button variant="danger" size="sm" onClick={() => deleteHabit(habit.id)}>
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </Button>
      </div>
    </motion.article>
  );
}
