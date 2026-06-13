/**
 * Typed Supabase database schema.
 *
 * This file mirrors the SQL schema in supabase/migrations/001_initial_schema.sql.
 * When you change the database schema, regenerate this with:
 *   npx supabase gen types typescript --local > types/database.ts
 *
 * For now, it is hand-written to match the initial migration exactly.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          level: number;
          title: string;
          xp: number;
          next_level_xp: number;
          streak: number;
          freeze_charges: number;
          quote: string;
          theme_color: string;
          glow_intensity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string;
          level?: number;
          title?: string;
          xp?: number;
          next_level_xp?: number;
          streak?: number;
          freeze_charges?: number;
          quote?: string;
          theme_color?: string;
          glow_intensity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          level?: number;
          title?: string;
          xp?: number;
          next_level_xp?: number;
          streak?: number;
          freeze_charges?: number;
          quote?: string;
          theme_color?: string;
          glow_intensity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      habits: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          icon_name: string;
          category: "Mind" | "Body" | "Focus" | "Craft" | "Recovery";
          difficulty: "Easy" | "Medium" | "Hard";
          cadence: "Daily" | "Weekly" | "Custom";
          xp_reward: number;
          color: string;
          note: string;
          sort_order: number;
          archived: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          icon_name?: string;
          category: "Mind" | "Body" | "Focus" | "Craft" | "Recovery";
          difficulty: "Easy" | "Medium" | "Hard";
          cadence: "Daily" | "Weekly" | "Custom";
          xp_reward?: number;
          color?: string;
          note?: string;
          sort_order?: number;
          archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          icon_name?: string;
          category?: "Mind" | "Body" | "Focus" | "Craft" | "Recovery";
          difficulty?: "Easy" | "Medium" | "Hard";
          cadence?: "Daily" | "Weekly" | "Custom";
          xp_reward?: number;
          color?: string;
          note?: string;
          sort_order?: number;
          archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "habits_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      habit_completions: {
        Row: {
          id: string;
          habit_id: string;
          user_id: string;
          completed_date: string;
          completed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          habit_id: string;
          user_id: string;
          completed_date: string;
          completed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          habit_id?: string;
          user_id?: string;
          completed_date?: string;
          completed?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "habit_completions_habit_id_fkey";
            columns: ["habit_id"];
            isOneToOne: false;
            referencedRelation: "habits";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "habit_completions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      focus_sessions: {
        Row: {
          id: string;
          user_id: string;
          started_at: string;
          ended_at: string | null;
          duration_minutes: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          started_at: string;
          ended_at?: string | null;
          duration_minutes?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          started_at?: string;
          ended_at?: string | null;
          duration_minutes?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "focus_sessions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      achievement_definitions: {
        Row: {
          id: string;
          title: string;
          description: string;
          rarity: "Common" | "Rare" | "Epic" | "Legendary";
          icon_name: string;
          criteria: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          rarity: "Common" | "Rare" | "Epic" | "Legendary";
          icon_name?: string;
          criteria?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          rarity?: "Common" | "Rare" | "Epic" | "Legendary";
          icon_name?: string;
          criteria?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          unlocked: boolean;
          progress: number;
          unlocked_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_id: string;
          unlocked?: boolean;
          progress?: number;
          unlocked_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          achievement_id?: string;
          unlocked?: boolean;
          progress?: number;
          unlocked_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_achievements_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_achievements_achievement_id_fkey";
            columns: ["achievement_id"];
            isOneToOne: false;
            referencedRelation: "achievement_definitions";
            referencedColumns: ["id"];
          }
        ];
      };
      user_settings: {
        Row: {
          user_id: string;
          habit_reminders: boolean;
          sound_effects: boolean;
          streak_freeze_warnings: boolean;
          calendar_integration: boolean;
          offline_mode: boolean;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          habit_reminders?: boolean;
          sound_effects?: boolean;
          streak_freeze_warnings?: boolean;
          calendar_integration?: boolean;
          offline_mode?: boolean;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          habit_reminders?: boolean;
          sound_effects?: boolean;
          streak_freeze_warnings?: boolean;
          calendar_integration?: boolean;
          offline_mode?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      mood_entries: {
        Row: {
          id: string;
          user_id: string;
          mood: "Low" | "Calm" | "Sharp" | "Lit" | "Zen";
          entry_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          mood: "Low" | "Calm" | "Sharp" | "Lit" | "Zen";
          entry_date?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          mood?: "Low" | "Calm" | "Sharp" | "Lit" | "Zen";
          entry_date?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "mood_entries_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      notes: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

// ─── Convenience aliases ─────────────────────────────────────────
// Use these throughout the app instead of deep-indexing the Database type.

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

// Named row types for direct import
export type Profile = Tables<"profiles">;
export type DbHabit = Tables<"habits">;
export type HabitCompletion = Tables<"habit_completions">;
export type FocusSession = Tables<"focus_sessions">;
export type AchievementDefinition = Tables<"achievement_definitions">;
export type UserAchievement = Tables<"user_achievements">;
export type UserSettings = Tables<"user_settings">;
export type MoodEntry = Tables<"mood_entries">;
export type Note = Tables<"notes">;
