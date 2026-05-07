import type { Metadata } from "next";
import { getSettings } from "@/lib/getSettings";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const url = s.seoSiteUrl || undefined;
  const og = s.seoOgImage || undefined;
  return {
    title: s.seoTitle,
    description: s.seoDescription,
    keywords: s.seoKeywords ? s.seoKeywords.split(",").map((k) => k.trim()).filter(Boolean) : undefined,
    metadataBase: url ? new URL(url) : undefined,
    openGraph: {
      title: s.seoTitle,
      description: s.seoDescription,
      type: "website",
      ...(url ? { url } : {}),
      ...(og ? { images: [{ url: og }] } : {})
    },
    twitter: {
      card: "summary_large_image",
      title: s.seoTitle,
      description: s.seoDescription,
      ...(og ? { images: [og] } : {})
    },
    icons: { icon: "/favicon.ico" }
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="antialiased scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="selection:bg-brand selection:text-white font-sans">{children}</body>
    </html>
  );
}
