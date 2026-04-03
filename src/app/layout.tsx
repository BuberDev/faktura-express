import type { Metadata, Viewport } from "next";

import "./globals.css";

const siteUrl = "https://faktura-express.pl";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Faktura Express | Darmowe Faktury B2B w 10 Sekund",
    template: "%s | Faktura Express",
  },
  description: "Najszybszy sposób na wystawianie profesjonalnych faktur online. Darmowe narzędzie B2B z podglądem PDF na żywo, bezpieczne i zgodne z polskim prawem.",
  keywords: ["faktura", "darmowe faktury", "fakturowanie online", "B2B", "faktura VAT", "proforma", "korekta", "GUS API"],
  authors: [{ name: "Faktura Express Team" }],
  creator: "Faktura Express",
  publisher: "Faktura Express",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: siteUrl,
    siteName: "Faktura Express",
    title: "Faktura Express | Darmowe Faktury B2B",
    description: "Wystawiaj profesjonalne faktury PDF w 10 sekund. Bez opłat, bez zbędnych formalności.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Faktura Express Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Faktura Express | Darmowe Faktury Online",
    description: "Profesjonalne fakturowanie dla nowoczesnych firm B2B.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Faktura Express",
    "operatingSystem": "Web",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "PLN"
    },
    "description": "Najszybsze narzędzie do wystawiania faktur online dla polskich przedsiębiorców.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "ratingCount": "100" // Placeholder for social proof
    }
  };

  return (
    <html lang="pl" className="h-full antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
