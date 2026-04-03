import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/settings/", "/invoices/new", "/auth/callback"],
      },
      // Allow AI agents to crawl the public landing page for better citation/LLM indexing
      {
        userAgent: ["GPTBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "Google-Extended"],
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/invoices/"],
      },
    ],
    sitemap: "https://fakturain.pl/sitemap.xml",
  };
}
