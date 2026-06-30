"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Target, Activity, Trophy, AlarmClock } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  
  const items = [
    { href: "/dashboard", label: "Dashboard", icon: Target },
    { href: "/analytics", label: "Analytics", icon: Activity },
    { href: "/achievements", label: "Achievements", icon: Trophy },
    { href: "/focus", label: "Focus", icon: AlarmClock }
  ];

  return (
    <nav className="fixed bottom-3 left-1/2 z-50 w-[calc(100vw-1.5rem)] max-w-[360px] -translate-x-1/2 overflow-hidden rounded-lg border border-pulse/40 bg-black/70 p-2 shadow-neon backdrop-blur-xl lg:hidden">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan/70 to-transparent" />
      <div className="grid w-full grid-cols-4 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "min-w-0 flex h-12 flex-col items-center justify-center gap-1 rounded-md text-[9px] font-bold uppercase text-slate-400 transition-all duration-300 active:scale-95",
                active ? "bg-pulse/25 text-white shadow-neon" : "hover:bg-white/[0.04] hover:text-cyan"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>
                {{
                  Dashboard: "Dash",
                  Analytics: "Stats",
                  Achievements: "Badges",
                  Focus: "Focus"
                }[item.label] ?? item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
