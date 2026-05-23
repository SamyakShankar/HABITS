import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border border-pulse/40 bg-pulse/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-purple-100 shadow-[0_0_16px_rgba(159,92,255,.18)]",
        className
      )}
      {...props}
    />
  );
}
