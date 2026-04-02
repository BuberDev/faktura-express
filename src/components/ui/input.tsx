import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-11 w-full rounded-md border border-[#E5E5E5] bg-white px-3 py-2 text-sm text-black outline-none transition placeholder:text-black/45 focus:border-gold focus:ring-2 focus:ring-gold/20 dark:border-[#262626] dark:bg-black dark:text-white dark:placeholder:text-white/45",
        className,
      )}
      {...props}
    />
  );
}
