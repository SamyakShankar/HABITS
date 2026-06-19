import {
  Activity,
  AlarmClock,
  BatteryCharging,
  Brain,
  CalendarCheck,
  Gem,
  Sparkles,
  Star,
  Target,
  Trophy
} from "lucide-react";

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

export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Target },
  { href: "/analytics", label: "Analytics", icon: Activity },
  { href: "/achievements", label: "Achievements", icon: Trophy },
  { href: "/focus", label: "Focus", icon: AlarmClock },
  { href: "/profile", label: "Progress", icon: Star }
];
