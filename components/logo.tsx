import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("group flex items-center gap-3", className)}>
      <div className="relative grid h-10 w-10 place-items-center">
        <div className="absolute inset-0 rotate-45 rounded bg-gradient-to-br from-cyan to-pulse blur-sm opacity-70 transition group-hover:opacity-100" />
        <div className="relative h-10 w-10 clip-corners border border-cyan/50 bg-black/70 shadow-neon">
          <div className="absolute left-2 top-1.5 h-7 w-2 bg-cyan shadow-cyan" />
          <div className="absolute right-2 top-1.5 h-7 w-2 bg-pulse shadow-neon" />
          <div className="absolute left-4 top-3 h-4 w-2 rotate-45 bg-white/90" />
        </div>
      </div>
      <span className="font-display text-lg font-black uppercase tracking-[0.16em] text-white neon-text">HABITS</span>
    </Link>
  );
}
