/**
 * Maps icon name strings to Lucide React components.
 *
 * The database stores icons as plain strings (e.g., "Brain").
 * This map resolves them to renderable components at runtime.
 *
 * When adding a new icon to the app, add it here too.
 */

import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlarmClock,
  BadgeCheck,
  BatteryCharging,
  Brain,
  CalendarCheck,
  Crown,
  Dumbbell,
  Flame,
  Gem,
  Moon,
  NotebookPen,
  Sparkles,
  Star,
  Sunrise,
  Target,
  Trophy,
  Zap
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  Activity,
  AlarmClock,
  BadgeCheck,
  BatteryCharging,
  Brain,
  CalendarCheck,
  Crown,
  Dumbbell,
  Flame,
  Gem,
  Moon,
  NotebookPen,
  Sparkles,
  Star,
  Sunrise,
  Target,
  Trophy,
  Zap
};

/** Safely resolve an icon name string to a Lucide component. Falls back to Target. */
export function resolveIcon(name: string | null | undefined): LucideIcon {
  if (!name) return Target;
  return iconMap[name] ?? Target;
}
