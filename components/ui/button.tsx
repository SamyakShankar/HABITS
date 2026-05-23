"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold uppercase tracking-[0.08em] transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse disabled:pointer-events-none disabled:opacity-50 active:translate-y-px",
  {
    variants: {
      variant: {
        default:
          "bg-pulse text-white shadow-neon hover:-translate-y-0.5 hover:bg-[#b98cff] hover:shadow-[0_0_28px_rgba(159,92,255,.85)]",
        cyan: "bg-cyan text-void shadow-cyan hover:-translate-y-0.5 hover:bg-[#7cf0ff]",
        ghost:
          "border border-pulse/35 bg-white/[0.03] text-white hover:-translate-y-0.5 hover:border-cyan/60 hover:bg-cyan/10 hover:text-cyan hover:shadow-cyan",
        danger:
          "border border-danger/50 bg-danger/10 text-danger hover:-translate-y-0.5 hover:bg-danger/20",
        dark: "border border-white/10 bg-black/30 text-white hover:-translate-y-0.5 hover:border-pulse/60 hover:bg-pulse/10"
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3 text-xs",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
