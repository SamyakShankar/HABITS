import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-md border border-pulse/30 bg-black/30 px-3 text-sm text-white outline-none transition focus:border-cyan/70 focus:shadow-cyan",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
