import type { LucideIcon } from "lucide-react";

export type HabitDifficulty = "Easy" | "Medium" | "Hard";
export type HabitCadence = "Daily" | "Weekly" | "Custom";
export type HabitCategory = "Mind" | "Body" | "Focus" | "Craft" | "Recovery";

export type Habit = {
  id: string;
  title: string;
  icon: LucideIcon;
  category: HabitCategory;
  difficulty: HabitDifficulty;
  cadence: HabitCadence;
  streak: number;
  xp: number;
  color: string;
  completed: boolean;
  completionHistory: boolean[];
  note: string;
};

export type Achievement = {
  title: string;
  description: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  unlocked: boolean;
  progress: number;
  icon: LucideIcon;
};
