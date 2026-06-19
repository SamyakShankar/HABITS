import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, FocusSession, InsertTables } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function saveFocusSession(supabase: Client, session: InsertTables<"focus_sessions">) {
  const { data, error } = await supabase
    .from("focus_sessions")
    .insert(session)
    .select()
    .single();
  if (error) throw error;
  return data as FocusSession;
}

export async function fetchFocusSessions(supabase: Client, userId: string, limit = 10) {
  const { data, error } = await supabase
    .from("focus_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("started_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as FocusSession[];
}
