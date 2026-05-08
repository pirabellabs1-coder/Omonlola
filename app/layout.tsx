import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import { getSettings } from "@/lib/getSettings";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans"
});

const display = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "700"],
  variable: "--font-display"
});

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
    }
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sans.variable} ${display.variable} antialiased scroll-smooth`}>
      <body className="selection:bg-brand selection:text-white font-sans">{children}</body>
    </html>
  );
}
