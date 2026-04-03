export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">{children}</div>;
}
