import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";

interface AuthShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-16">
      <Card className="border-gold-subtle">
        <div className="mb-6 space-y-2 text-center">
          <h1 className="font-display text-3xl tracking-tight text-black dark:text-white">{title}</h1>
          <p className="text-sm text-black/65 dark:text-white/65">{description}</p>
        </div>
        {children}
      </Card>
    </div>
  );
}
