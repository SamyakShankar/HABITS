"use client";

import { create } from "zustand";
import { habits as initialHabits } from "@/lib/mock-data";
import type { Habit } from "@/types";

type HabitState = {
  habits: Habit[];
  selectedCategory: string;
  setCategory: (category: string) => void;
  toggleHabit: (id: string) => void;
  deleteHabit: (id: string) => void;
  addHabit: (habit: Habit) => void;
};

export const useHabitStore = create<HabitState>((set) => ({
  habits: initialHabits,
  selectedCategory: "All",
  setCategory: (category) => set({ selectedCategory: category }),
  toggleHabit: (id) =>
    set((state) => ({
      habits: state.habits.map((habit) =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      )
    })),
  deleteHabit: (id) =>
    set((state) => ({
      habits: state.habits.filter((habit) => habit.id !== id)
    })),
  addHabit: (habit) => set((state) => ({ habits: [habit, ...state.habits] }))
}));
