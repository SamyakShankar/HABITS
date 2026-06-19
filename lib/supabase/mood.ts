import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, MoodEntry, InsertTables } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function saveMoodEntry(supabase: Client, entry: InsertTables<"mood_entries">) {
  const { data, error } = await supabase
    .from("mood_entries")
    .upsert(entry, { onConflict: "user_id,entry_date" })
    .select()
    .single();
  if (error) throw error;
  return data as MoodEntry;
}

export async function fetchMoodEntries(
  supabase: Client,
  userId: string,
  startDate: string,
  endDate: string
) {
  const { data, error } = await supabase
    .from("mood_entries")
    .select("*")
    .eq("user_id", userId)
    .gte("entry_date", startDate)
    .lte("entry_date", endDate)
    .order("entry_date", { ascending: true });
  if (error) throw error;
  return (data ?? []) as MoodEntry[];
}
