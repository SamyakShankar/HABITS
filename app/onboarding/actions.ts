"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createHabit, fetchHabits } from "@/lib/supabase/queries";

export async function completeOnboarding() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Check if they already have habits to avoid duplicates on re-submission
  const existingHabits = await fetchHabits(supabase, user.id);
  
  if (existingHabits.length === 0) {
    // 1. Deep Work Block
    await createHabit(supabase, {
      user_id: user.id,
      title: "Deep Work Block",
      icon_name: "Brain",
      category: "Focus",
      difficulty: "Hard",
      cadence: "Daily",
      xp_reward: 50,
      color: "#9f5cff",
      note: "No phone, one objective.",
      sort_order: 1,
    });

    // 2. Morning Mobility
    await createHabit(supabase, {
      user_id: user.id,
      title: "Morning Mobility",
      icon_name: "Dumbbell",
      category: "Body",
      difficulty: "Medium",
      cadence: "Daily",
      xp_reward: 25,
      color: "#32e6ff",
      note: "15 minutes before screens.",
      sort_order: 2,
    });

    // 3. Read 12 Pages
    await createHabit(supabase, {
      user_id: user.id,
      title: "Read 12 Pages",
      icon_name: "NotebookPen",
      category: "Mind",
      difficulty: "Easy",
      cadence: "Daily",
      xp_reward: 10,
      color: "#42ffba",
      note: "Keep notes in the journal.",
      sort_order: 3,
    });

    // 4. Sleep Shutdown
    await createHabit(supabase, {
      user_id: user.id,
      title: "Sleep Shutdown",
      icon_name: "Moon",
      category: "Recovery",
      difficulty: "Medium",
      cadence: "Custom",
      xp_reward: 25,
      color: "#ff4fd8",
      note: "Lights low by 11:00 PM.",
      sort_order: 4,
    });
  }

  redirect("/dashboard");
}
