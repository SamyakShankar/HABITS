"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app-store";
import { createClient } from "@/lib/supabase/client";
import type { DbHabit } from "@/types/database";
import { ICON_NAMES, resolveIcon } from "@/lib/icon-map";

const CATEGORIES: DbHabit["category"][] = ["Mind", "Body", "Focus", "Craft", "Recovery"];
const DIFFICULTIES: DbHabit["difficulty"][] = ["Easy", "Medium", "Hard"];
const CADENCES: DbHabit["cadence"][] = ["Daily", "Weekly", "Custom"];

const COLORS = [
  "#9f5cff", "#32e6ff", "#42ffba", "#ff4fd8", "#ffbb33",
  "#ff5e57", "#5effe8", "#a78bfa"
];

const XP_BY_DIFF: Record<DbHabit["difficulty"], number> = {
  Easy: 10,
  Medium: 25,
  Hard: 50
};

interface CreateHabitModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateHabitModal({ open, onClose }: CreateHabitModalProps) {
  const createHabit = useAppStore((state) => state.createHabit);
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<DbHabit["category"]>("Mind");
  const [difficulty, setDifficulty] = useState<DbHabit["difficulty"]>("Easy");
  const [cadence, setCadence] = useState<DbHabit["cadence"]>("Daily");
  const [color, setColor] = useState(COLORS[0]);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError("Habit name is required."); return; }
    setSaving(true);
    setError("");
    try {
      await createHabit(supabase, { title: title.trim(), category, difficulty, cadence, color, note });
      setTitle(""); setNote(""); setCategory("Mind"); setDifficulty("Easy"); setCadence("Daily"); setColor(COLORS[0]);
      onClose();
    } catch {
      setError("Failed to create habit. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-md overflow-hidden rounded-xl border border-pulse/50 bg-[#0a0f1e] shadow-neon"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Glow top strip */}
            <div className="h-1 w-full bg-gradient-to-r from-cyan via-pulse to-mint" />

            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan">New Habit</p>
                  <h2 className="mt-1 font-display text-xl font-black uppercase text-white">Create System</h2>
                </div>
                <button
                  onClick={onClose}
                  className="grid h-8 w-8 place-items-center rounded-md border border-white/10 text-slate-400 hover:border-pulse/40 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                    Habit Name
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Deep Work Block"
                    className="w-full rounded-md border border-pulse/30 bg-black/40 px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan/60 focus:ring-1 focus:ring-cyan/20"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`rounded-md border px-3 py-1.5 text-xs font-bold uppercase transition-colors ${
                          category === cat
                            ? "border-cyan/70 bg-cyan/15 text-cyan"
                            : "border-white/10 bg-black/25 text-slate-400 hover:border-white/25 hover:text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty & Cadence */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                      Difficulty
                    </label>
                    <div className="space-y-1.5">
                      {DIFFICULTIES.map((diff) => (
                        <button
                          key={diff}
                          type="button"
                          onClick={() => setDifficulty(diff)}
                          className={`w-full rounded-md border px-3 py-1.5 text-xs font-bold uppercase transition-colors ${
                            difficulty === diff
                              ? "border-pulse/70 bg-pulse/15 text-pulse"
                              : "border-white/10 bg-black/25 text-slate-400 hover:border-white/25 hover:text-white"
                          }`}
                        >
                          {diff} (+{XP_BY_DIFF[diff]} XP)
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                      Cadence
                    </label>
                    <div className="space-y-1.5">
                      {CADENCES.map((cad) => (
                        <button
                          key={cad}
                          type="button"
                          onClick={() => setCadence(cad)}
                          className={`w-full rounded-md border px-3 py-1.5 text-xs font-bold uppercase transition-colors ${
                            cadence === cad
                              ? "border-mint/70 bg-mint/15 text-mint"
                              : "border-white/10 bg-black/25 text-slate-400 hover:border-white/25 hover:text-white"
                          }`}
                        >
                          {cad}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Color */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                    Color
                  </label>
                  <div className="flex gap-2">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className="h-7 w-7 rounded-full border-2 transition-transform hover:scale-110"
                        style={{
                          backgroundColor: c,
                          borderColor: color === c ? "white" : "transparent",
                          boxShadow: color === c ? `0 0 10px ${c}` : "none"
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                    Note (optional)
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. No phone, one objective."
                    className="w-full rounded-md border border-pulse/30 bg-black/40 px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan/60 focus:ring-1 focus:ring-cyan/20"
                  />
                </div>

                {error && <p className="text-xs text-danger">{error}</p>}

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={saving}>
                    {saving ? "Creating..." : "Create Habit"}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
