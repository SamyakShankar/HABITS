import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Profile, UserSettings, UpdateTables } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function getCurrentUser(supabase: Client) {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function fetchProfile(supabase: Client, userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data as Profile;
}

export async function updateProfile(
  supabase: Client,
  userId: string,
  updates: UpdateTables<"profiles">
) {
  const { data, error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();
  if (error) throw error;
  return data as Profile;
}

export async function fetchSettings(supabase: Client, userId: string) {
  const { data, error } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (error) throw error;
  return data as UserSettings;
}

export async function updateSettings(
  supabase: Client,
  userId: string,
  updates: UpdateTables<"user_settings">
) {
  const { data, error } = await supabase
    .from("user_settings")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .select()
    .single();
  if (error) throw error;
  return data as UserSettings;
}
