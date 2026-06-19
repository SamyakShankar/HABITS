import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, AchievementDefinition, UserAchievement } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function fetchAchievementDefinitions(supabase: Client) {
  const { data, error } = await supabase
    .from("achievement_definitions")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as AchievementDefinition[];
}

export async function fetchUserAchievements(supabase: Client, userId: string) {
  const { data, error } = await supabase
    .from("user_achievements")
    .select("*, achievement_definitions(*)")
    .eq("user_id", userId);
  if (error) throw error;
  return (data ?? []) as (UserAchievement & {
    achievement_definitions: AchievementDefinition;
  })[];
}

export async function updateAchievementProgress(
  supabase: Client,
  userId: string,
  achievementId: string,
  progress: number,
  unlocked: boolean
) {
  const { data, error } = await supabase
    .from("user_achievements")
    .update({
      progress,
      unlocked,
      unlocked_at: unlocked ? new Date().toISOString() : null
    })
    .eq("user_id", userId)
    .eq("achievement_id", achievementId)
    .select()
    .single();
  if (error) throw error;
  return data as UserAchievement;
}
