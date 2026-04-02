export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8">
        <h1 className="font-display text-2xl tracking-wide">Faktura Express</h1>
      </div>
      {children}
    </div>
  );
}
