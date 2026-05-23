"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

export function Progress({
  className,
  value,
  indicatorClassName,
  ...props
}: React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & { indicatorClassName?: string }) {
  return (
    <ProgressPrimitive.Root
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-white/10", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "relative h-full overflow-hidden rounded-full bg-gradient-to-r from-cyan via-pulse to-danger shadow-neon transition-transform duration-700 ease-out after:absolute after:inset-y-0 after:left-0 after:w-1/3 after:animate-pulse after:bg-white/35 after:blur-sm",
          indicatorClassName
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
