import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-md border border-[#E5E5E5] bg-gradient-to-b from-white to-[#F9F9F9] p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] dark:border-[#262626] dark:bg-dark-surface dark:shadow-[0_4px_10px_rgba(0,0,0,0.9)]",
        className,
      )}
      {...props}
    />
  );
}
