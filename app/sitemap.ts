import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/getSettings";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const s = await getSettings();
  const base = s.seoSiteUrl || "";
  if (!base) return [];
  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    }
  ];
}
