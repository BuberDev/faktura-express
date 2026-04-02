import { type ReactNode } from "react";

import { Label } from "@/components/ui/label";

interface FormFieldProps {
  label: string;
  error?: string;
  htmlFor: string;
  children: ReactNode;
}

export function FormField({ label, error, htmlFor, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? <p className="text-xs text-[#996515]">{error}</p> : null}
    </div>
  );
}
