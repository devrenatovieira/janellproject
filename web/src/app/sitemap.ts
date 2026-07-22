import type { MetadataRoute } from "next";
import { services } from "@/content/site";
import { availableYears } from "@/content/transparency";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/sobre",
    "/nossa-historia",
    "/servicos",
    "/familia-acolhedora",
    "/adocao",
    "/doacao",
    "/voluntario",
    "/padrinho",
    "/blog",
    "/transparencia",
    "/galeria",
    "/midia",
    "/videos",
    "/contato",
    "/privacidade",
    "/termos",
  ];

  const now = new Date();

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${siteUrl}${path || "/"}`,
    lastModified: now,
    changeFrequency: path === "" || path === "/doacao" ? "weekly" : "monthly",
    priority:
      path === ""
        ? 1
        : path === "/doacao" || path === "/transparencia"
          ? 0.9
          : 0.7,
  }));

  for (const s of services) {
    entries.push({
      url: `${siteUrl}/servicos/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    });
  }

  for (const y of availableYears()) {
    entries.push({
      url: `${siteUrl}/transparencia/${y}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.65,
    });
  }

  return entries;
}
