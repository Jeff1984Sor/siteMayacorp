import type { MetadataRoute } from "next";
import { PRODUTOS } from "@/content/produtos";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();
  return [
    { url: SITE_URL, lastModified: agora, changeFrequency: "monthly", priority: 1 },
    ...PRODUTOS.map((p) => ({
      url: `${SITE_URL}/produtos/${p.slug}`,
      lastModified: agora,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/privacidade`, lastModified: agora, changeFrequency: "yearly", priority: 0.3 },
  ];
}
