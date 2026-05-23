import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "min-h-28 w-full rounded-md border border-pulse/30 bg-black/30 p-3 text-sm text-white outline-none transition focus:border-cyan/70 focus:shadow-cyan",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
