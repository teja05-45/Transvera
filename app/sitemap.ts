import type { MetadataRoute } from "next";
import { converters } from "@/data/converters";
import { useCases } from "@/data/use-cases";
import { articles } from "@/data/resources";

const BASE = "https://ledgerflow.example";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "", "/tools", "/bulk", "/pricing", "/how-it-works", "/faq",
    "/security", "/privacy", "/terms", "/contact", "/resources",
  ];

  return [
    ...staticRoutes.map((route) => ({ url: `${BASE}${route}`, lastModified: new Date() })),
    ...converters.map((c) => ({ url: `${BASE}/tools/${c.slug}`, lastModified: new Date() })),
    ...useCases.map((u) => ({ url: `${BASE}/use-cases/${u.slug}`, lastModified: new Date() })),
    ...articles.map((a) => ({ url: `${BASE}/resources/${a.slug}`, lastModified: new Date() })),
  ];
}
