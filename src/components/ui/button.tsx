import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline" | "ghost" | "default" | "secondary" | "destructive" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg" | "xs";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gold text-black shadow-gold-md hover:shadow-gold-lg hover:brightness-105 focus-visible:ring-2 focus-visible:ring-gold/40",
  outline:
    "border border-gold-subtle bg-transparent text-white hover:bg-gold/10 focus-visible:ring-2 focus-visible:ring-gold/30",
  ghost: "bg-transparent text-white hover:bg-white/5",
  default: "bg-gold text-black shadow-gold-md hover:shadow-gold-lg hover:brightness-105 focus-visible:ring-2 focus-visible:ring-gold/40",
  secondary: "border border-white/20 bg-white/5 text-white hover:bg-white/10",
  destructive: "bg-white text-black hover:bg-white/90",
  link: "bg-transparent text-gold underline-offset-4 hover:underline",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-11 px-4 py-2 text-sm",
  sm: "h-9 px-3 text-xs",
  lg: "h-12 px-6 text-base",
  xs: "h-8 px-2 text-xs",
  icon: "h-11 w-11 p-0",
  "icon-sm": "h-9 w-9 p-0",
  "icon-lg": "h-12 w-12 p-0",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-all disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
