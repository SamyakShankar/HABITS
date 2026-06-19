import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Note, InsertTables } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function createNote(supabase: Client, note: InsertTables<"notes">) {
  const { data, error } = await supabase
    .from("notes")
    .insert(note)
    .select()
    .single();
  if (error) throw error;
  return data as Note;
}

export async function fetchNotes(supabase: Client, userId: string, limit = 20) {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Note[];
}

export async function deleteNote(supabase: Client, noteId: string) {
  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", noteId);
  if (error) throw error;
}
