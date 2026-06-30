"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronRight, CloudOff, Settings, Target, Activity, Trophy, AlarmClock, Star } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MobileNav } from "@/components/shell/mobile-nav";
import { cn } from "@/lib/utils";
import { pageTransition, smoothTransition } from "@/lib/motion";

import { DataProvider } from "@/components/data-provider";
import { useAppStore } from "@/store/app-store";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <DataProvider>
      <AppShellInner>{children}</AppShellInner>
    </DataProvider>
  );
}

function AppShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const profile = useAppStore((state) => state.profile);

  // Fallback values while loading or if profile is missing
  const level = profile?.level ?? 1;
  const title = profile?.title ?? "Novice";
  const xp = profile?.xp ?? 0;
  const nextLevelXp = profile?.next_level_xp ?? 100;
  const progressPercent = Math.min(100, Math.max(0, (xp / nextLevelXp) * 100));

  return (
    <div className="relative z-10 min-h-screen pb-24 lg:pb-0">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 border-r border-pulse/20 bg-black/35 p-5 backdrop-blur-2xl lg:block">
        <Logo />
        <div className="mt-8 rounded-lg border border-pulse/30 bg-pulse/10 p-4 shadow-insetGlow">
          <div className="flex items-center justify-between">
            <Badge>Level {level}</Badge>
            <span className="text-xs font-bold uppercase text-cyan">{title}</span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan to-pulse shadow-neon"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.1 }}
            />
          </div>
          <p className="mt-3 text-xs text-slate-300">{nextLevelXp - xp} XP to next level</p>
        </div>
        <nav className="mt-8 space-y-2">
          {[
            { href: "/dashboard", label: "Dashboard", icon: Target },
            { href: "/focus", label: "Focus", icon: AlarmClock },
            { href: "/analytics", label: "Analytics", icon: Activity },
            { href: "/achievements", label: "Achievements", icon: Trophy },
            { href: "/profile", label: "Progress", icon: Star },
            { href: "/settings", label: "Settings", icon: Settings },
            { href: "/auth/logout", label: "Logout", icon: CloudOff }
          ].map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between rounded-md border border-transparent px-4 py-3 text-sm font-bold uppercase tracking-[0.1em] text-slate-400 transition-all duration-300",
                  active
                    ? "border-pulse/50 bg-pulse/15 text-white shadow-neon"
                    : "hover:border-cyan/35 hover:bg-cyan/10 hover:text-cyan"
                )}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </span>
                <ChevronRight className="h-4 w-4 opacity-40 transition group-hover:translate-x-1" />
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="min-w-0 overflow-x-hidden lg:pl-72">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-pulse/20 bg-void/65 px-4 backdrop-blur-2xl sm:px-6 lg:px-8">
          <Logo className="lg:hidden" />
          <div className="hidden lg:block">
            <p className="font-display text-xs font-bold uppercase tracking-[0.28em] text-cyan">Personal Operating System</p>
            <h1 className="mt-1 text-lg font-bold text-white">Upgrade loop active</h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="hidden border-mint/40 bg-mint/10 text-mint sm:flex">
              <CloudOff className="mr-2 h-3 w-3" />
              Offline-ready UI
            </Badge>
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={smoothTransition}
            className="px-4 py-6 sm:px-6 lg:px-8"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <MobileNav />
    </div>
  );
}
