import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Faktura Express",
  description: "Premium fakturowanie online dla przedsiębiorców B2B.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className="h-full antialiased">
      <body className="min-h-full bg-background text-foreground">{children}</body>
    </html>
  );
}
