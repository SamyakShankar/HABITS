-- ╔══════════════════════════════════════════════════════════════════╗
-- ║  HABITS — Initial database schema                              ║
-- ║  Run against a fresh Supabase project via the SQL Editor        ║
-- ║  or with: supabase db push                                      ║
-- ╚══════════════════════════════════════════════════════════════════╝


-- ─── 1. PROFILES ─────────────────────────────────────────────────
-- One row per auth.users entry. Created automatically via trigger.

CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL DEFAULT '',
  level           INT NOT NULL DEFAULT 1,
  title           TEXT NOT NULL DEFAULT 'Beginner',
  xp              INT NOT NULL DEFAULT 0,
  next_level_xp   INT NOT NULL DEFAULT 1000,
  streak          INT NOT NULL DEFAULT 0,
  freeze_charges  INT NOT NULL DEFAULT 2,
  quote           TEXT DEFAULT '',
  theme_color     TEXT DEFAULT '#9f5cff',
  glow_intensity  INT DEFAULT 82,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Auto-create a profile row when a new user signs up.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- ─── 2. HABITS ───────────────────────────────────────────────────

CREATE TABLE habits (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  icon_name   TEXT NOT NULL DEFAULT 'Target',
  category    TEXT NOT NULL CHECK (category IN ('Mind','Body','Focus','Craft','Recovery')),
  difficulty  TEXT NOT NULL CHECK (difficulty IN ('Easy','Medium','Hard')),
  cadence     TEXT NOT NULL CHECK (cadence IN ('Daily','Weekly','Custom')),
  xp_reward   INT NOT NULL DEFAULT 10,
  color       TEXT NOT NULL DEFAULT '#9f5cff',
  note        TEXT DEFAULT '',
  sort_order  INT DEFAULT 0,
  archived    BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_habits_user_id ON habits(user_id);

ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own habits"
  ON habits FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ─── 3. HABIT COMPLETIONS ────────────────────────────────────────

CREATE TABLE habit_completions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id        UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_date  DATE NOT NULL,
  completed       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(habit_id, completed_date)
);

CREATE INDEX idx_completions_user_date ON habit_completions(user_id, completed_date);
CREATE INDEX idx_completions_habit_date ON habit_completions(habit_id, completed_date);

ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own completions"
  ON habit_completions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ─── 4. FOCUS SESSIONS ──────────────────────────────────────────

CREATE TABLE focus_sessions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at        TIMESTAMPTZ NOT NULL,
  ended_at          TIMESTAMPTZ,
  duration_minutes  INT NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_focus_user_started ON focus_sessions(user_id, started_at);

ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own focus sessions"
  ON focus_sessions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ─── 5. ACHIEVEMENT DEFINITIONS ─────────────────────────────────
-- Global table — same definitions for all users. Read-only for users.

CREATE TABLE achievement_definitions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  rarity      TEXT NOT NULL CHECK (rarity IN ('Common','Rare','Epic','Legendary')),
  icon_name   TEXT NOT NULL DEFAULT 'Trophy',
  criteria    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE achievement_definitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can read achievements"
  ON achievement_definitions FOR SELECT
  USING (auth.role() = 'authenticated');


-- ─── 6. USER ACHIEVEMENTS ───────────────────────────────────────

CREATE TABLE user_achievements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id  UUID NOT NULL REFERENCES achievement_definitions(id) ON DELETE CASCADE,
  unlocked        BOOLEAN NOT NULL DEFAULT false,
  progress        INT NOT NULL DEFAULT 0,
  unlocked_at     TIMESTAMPTZ,
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own achievement progress"
  ON user_achievements FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ─── 7. USER SETTINGS ───────────────────────────────────────────

CREATE TABLE user_settings (
  user_id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  habit_reminders        BOOLEAN DEFAULT true,
  sound_effects          BOOLEAN DEFAULT true,
  streak_freeze_warnings BOOLEAN DEFAULT true,
  calendar_integration   BOOLEAN DEFAULT false,
  offline_mode           BOOLEAN DEFAULT true,
  updated_at             TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own settings"
  ON user_settings FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ─── 8. MOOD ENTRIES ─────────────────────────────────────────────

CREATE TABLE mood_entries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood        TEXT NOT NULL CHECK (mood IN ('Low','Calm','Sharp','Lit','Zen')),
  entry_date  DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, entry_date)
);

CREATE INDEX idx_mood_user_date ON mood_entries(user_id, entry_date);

ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own mood entries"
  ON mood_entries FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ─── 9. NOTES ────────────────────────────────────────────────────

CREATE TABLE notes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_notes_user ON notes(user_id);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own notes"
  ON notes FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ─── 10. SEED: ACHIEVEMENT DEFINITIONS ──────────────────────────
-- These are the 6 achievements from the current mock data.

INSERT INTO achievement_definitions (title, description, rarity, icon_name, criteria) VALUES
  ('7 Day Streak',       'Hold the line for a full week.',        'Rare',      'Flame',    '{"type": "streak", "days": 7}'),
  ('Deep Focus Master',  'Log 10 cinematic focus sessions.',      'Epic',      'Zap',      '{"type": "focus_sessions", "count": 10}'),
  ('Early Bird',         'Complete 5 habits before 9 AM.',        'Common',    'Sunrise',  '{"type": "early_completions", "count": 5}'),
  ('30 Day Streak',      'Become dangerously consistent.',        'Legendary', 'Crown',    '{"type": "streak", "days": 30}'),
  ('No Missed Day',      'Finish every planned habit in a day.',  'Epic',      'BadgeCheck','{"type": "perfect_day", "count": 1}'),
  ('Consistency King',   'Reach 90% weekly discipline.',          'Legendary', 'Trophy',   '{"type": "weekly_discipline", "percent": 90}');


-- ─── 11. HELPER: AUTO-CREATE SETTINGS ROW ────────────────────────
-- When a profile is created, also create a default settings row.

CREATE OR REPLACE FUNCTION public.handle_new_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_settings (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_profile();


-- ─── 12. HELPER: AUTO-SEED USER ACHIEVEMENTS ────────────────────
-- When a profile is created, create progress rows for all achievements.

CREATE OR REPLACE FUNCTION public.seed_user_achievements()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_achievements (user_id, achievement_id)
  SELECT NEW.id, ad.id
  FROM public.achievement_definitions ad;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_created_seed_achievements
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.seed_user_achievements();
