import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/getSettings";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const s = await getSettings();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/manage/", "/review/", "/api/"]
      }
    ],
    ...(s.seoSiteUrl ? { sitemap: `${s.seoSiteUrl}/sitemap.xml` } : {})
  };
}
