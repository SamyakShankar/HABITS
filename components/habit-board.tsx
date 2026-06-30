"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { HabitCard } from "@/components/habit-card";
import { Button } from "@/components/ui/button";
import { CreateHabitModal } from "@/components/create-habit-modal";
import { useAppStore } from "@/store/app-store";
import { cardReveal, smoothTransition } from "@/lib/motion";

const categories = ["All", "Mind", "Body", "Focus", "Craft", "Recovery"];

export function HabitBoard() {
  const { habits, selectedCategory, setCategory } = useAppStore();
  const [createOpen, setCreateOpen] = useState(false);

  const filteredHabits =
    selectedCategory === "All" ? habits : habits.filter((habit) => habit.category === selectedCategory);

  return (
    <>
      <CreateHabitModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <div>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setCategory(category)}
                className={`rounded-md border px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] transition ${
                  selectedCategory === category
                    ? "border-cyan/70 bg-cyan/15 text-cyan shadow-cyan"
                    : "border-pulse/30 bg-black/20 text-slate-400 hover:border-pulse/60 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Habit
          </Button>
        </div>
        {habits.length === 0 ? (
          <div className="rounded-lg border border-dashed border-cyan/35 bg-cyan/5 p-8 text-center">
            <p className="text-sm text-slate-400">No habits yet. Create your first system.</p>
            <Button className="mt-4" onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              Create First Habit
            </Button>
          </div>
        ) : filteredHabits.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">No habits in this category.</p>
        ) : (
          <motion.div
            layout
            className="grid gap-4 xl:grid-cols-2"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.045 } } }}
          >
            {filteredHabits.map((habit) => (
              <motion.div key={habit.id} variants={cardReveal} transition={smoothTransition}>
                <HabitCard habit={habit} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
}
