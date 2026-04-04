import { SilkBackground } from "@/components/ui/silk-background-animation";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark min-h-screen bg-transparent text-white">
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <SilkBackground />
      </div>
      {children}
    </div>
  );
}
