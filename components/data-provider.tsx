"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/store/app-store";
import { fetchProfile } from "@/lib/supabase/profile";
import { fetchHabits, fetchCompletions } from "@/lib/supabase/habits";
import { fetchFocusSessions } from "@/lib/supabase/focus";
import { fetchUserAchievements } from "@/lib/supabase/achievements";
import { fetchNotes } from "@/lib/supabase/notes";
import { fetchMoodEntries } from "@/lib/supabase/mood";
import { subDays, format } from "date-fns";

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);
  const setRawData = useAppStore((state) => state.setRawData);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    async function loadData() {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log("No authenticated user found.");
          setLoading(false);
          return;
        }

        const userId = session.user.id;
        
        const todayStr = format(new Date(), "yyyy-MM-dd");
        const last42Days = format(subDays(new Date(), 42), "yyyy-MM-dd");

        const [
          profile,
          habits,
          completions,
          focusSessions,
          achievements,
          notes,
          moods
        ] = await Promise.all([
          fetchProfile(supabase, userId).catch(() => null),
          fetchHabits(supabase, userId).catch(() => []),
          fetchCompletions(supabase, userId, last42Days, todayStr).catch(() => []),
          fetchFocusSessions(supabase, userId).catch(() => []),
          fetchUserAchievements(supabase, userId).catch(() => []),
          fetchNotes(supabase, userId).catch(() => []),
          fetchMoodEntries(supabase, userId, last42Days, todayStr).catch(() => [])
        ]);

        if (profile) {
          setRawData(profile, habits, completions, focusSessions, achievements, notes, moods);
        }
      } catch (error) {
        console.error("Failed to load initial data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [setRawData]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050712]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-y-2 border-cyan" />
          <p className="font-display text-sm font-black uppercase tracking-[0.2em] text-cyan neon-text">
            Initializing OS...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
