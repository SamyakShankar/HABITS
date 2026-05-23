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
import type { Achievement, Habit } from "@/types";

export const xpProfile = {
  name: "Samyak",
  level: 12,
  title: "Disciplined",
  streak: 3,
  xp: 3580,
  nextLevelXp: 4000,
  weeklyConsistency: 86,
  dailyProgress: 74,
  focusMinutes: 145,
  freezeCharges: 2,
  quote: "Small wins compound into identity."
};

export const habits: Habit[] = [
  {
    id: "h1",
    title: "Deep Work Block",
    icon: Brain,
    category: "Focus",
    difficulty: "Hard",
    cadence: "Daily",
    streak: 9,
    xp: 50,
    color: "#9f5cff",
    completed: true,
    completionHistory: [true, true, true, false, true, true, true, true, true, true, true, true],
    note: "No phone, one objective."
  },
  {
    id: "h2",
    title: "Morning Mobility",
    icon: Dumbbell,
    category: "Body",
    difficulty: "Medium",
    cadence: "Daily",
    streak: 14,
    xp: 25,
    color: "#32e6ff",
    completed: false,
    completionHistory: [true, true, false, true, true, true, true, true, true, false, true, true],
    note: "15 minutes before screens."
  },
  {
    id: "h3",
    title: "Read 12 Pages",
    icon: NotebookPen,
    category: "Mind",
    difficulty: "Easy",
    cadence: "Daily",
    streak: 6,
    xp: 10,
    color: "#42ffba",
    completed: true,
    completionHistory: [true, false, true, true, true, true, false, true, true, true, true, true],
    note: "Keep notes in the journal."
  },
  {
    id: "h4",
    title: "Sleep Shutdown",
    icon: Moon,
    category: "Recovery",
    difficulty: "Medium",
    cadence: "Custom",
    streak: 4,
    xp: 25,
    color: "#ff4fd8",
    completed: false,
    completionHistory: [false, true, true, true, false, true, true, true, true, false, true, false],
    note: "Lights low by 11:00 PM."
  }
];

export const weeklyData = [
  { day: "Mon", completion: 68, focus: 72 },
  { day: "Tue", completion: 76, focus: 90 },
  { day: "Wed", completion: 58, focus: 54 },
  { day: "Thu", completion: 88, focus: 116 },
  { day: "Fri", completion: 94, focus: 140 },
  { day: "Sat", completion: 72, focus: 84 },
  { day: "Sun", completion: 86, focus: 130 }
];

export const monthlyTrend = [
  { week: "W1", xp: 620, discipline: 71 },
  { week: "W2", xp: 760, discipline: 78 },
  { week: "W3", xp: 920, discipline: 82 },
  { week: "W4", xp: 1180, discipline: 89 }
];

export const heatmap = Array.from({ length: 42 }, (_, index) => {
  const values = [15, 32, 48, 64, 78, 92];
  return values[(index * 7 + index) % values.length];
});

export const achievements: Achievement[] = [
  {
    title: "7 Day Streak",
    description: "Hold the line for a full week.",
    rarity: "Rare",
    unlocked: true,
    progress: 100,
    icon: Flame
  },
  {
    title: "Deep Focus Master",
    description: "Log 10 cinematic focus sessions.",
    rarity: "Epic",
    unlocked: true,
    progress: 100,
    icon: Zap
  },
  {
    title: "Early Bird",
    description: "Complete 5 habits before 9 AM.",
    rarity: "Common",
    unlocked: true,
    progress: 100,
    icon: Sunrise
  },
  {
    title: "30 Day Streak",
    description: "Become dangerously consistent.",
    rarity: "Legendary",
    unlocked: false,
    progress: 46,
    icon: Crown
  },
  {
    title: "No Missed Day",
    description: "Finish every planned habit in a day.",
    rarity: "Epic",
    unlocked: false,
    progress: 82,
    icon: BadgeCheck
  },
  {
    title: "Consistency King",
    description: "Reach 90% weekly discipline.",
    rarity: "Legendary",
    unlocked: false,
    progress: 86,
    icon: Trophy
  }
];

export const focusHistory = [
  { label: "Today", minutes: 145, sessions: 4 },
  { label: "Tue", minutes: 92, sessions: 3 },
  { label: "Mon", minutes: 76, sessions: 2 },
  { label: "Sun", minutes: 130, sessions: 4 }
];

export const quickActions = [
  { label: "Create Habit", icon: Target },
  { label: "Start Focus", icon: AlarmClock },
  { label: "Daily Review", icon: CalendarCheck },
  { label: "Claim XP", icon: Gem }
];

export const insightCards = [
  { label: "Peak Focus Window", value: "9:20 AM", icon: BatteryCharging },
  { label: "Best Category", value: "Focus", icon: Brain },
  { label: "Mood Signal", value: "Calm", icon: Sparkles },
  { label: "Energy Curve", value: "+18%", icon: Activity }
];

export const categoryScores = [
  { name: "Mind", score: 82 },
  { name: "Body", score: 71 },
  { name: "Focus", score: 94 },
  { name: "Craft", score: 68 },
  { name: "Recovery", score: 76 }
];

export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Target },
  { href: "/analytics", label: "Analytics", icon: Activity },
  { href: "/achievements", label: "Achievements", icon: Trophy },
  { href: "/focus", label: "Focus", icon: AlarmClock },
  { href: "/profile", label: "Progress", icon: Star }
];
