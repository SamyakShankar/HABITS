import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type NeonPanelProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  kicker?: string;
};

export function NeonPanel({ title, kicker, className, children, ...props }: NeonPanelProps) {
  return (
    <section className={cn("glass-panel premium-hover clip-corners rounded-lg p-4", className)} {...props}>
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      {(title || kicker) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {kicker && <p className="font-display text-[10px] font-bold uppercase tracking-[0.22em] text-cyan">{kicker}</p>}
            {title && <h2 className="mt-1 font-display text-sm font-black uppercase text-white neon-text">{title}</h2>}
          </div>
        </div>
      )}
      {children}
    </section>
  );
}
