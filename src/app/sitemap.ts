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
      priority: p.slug === "mayajus" ? 0.9 : 0.8,
    })),
    { url: `${SITE_URL}/produtos/mayajus/contratar`, lastModified: agora, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/produtos/mayajus/termos`, lastModified: agora, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/privacidade`, lastModified: agora, changeFrequency: "yearly", priority: 0.3 },
  ];
}
