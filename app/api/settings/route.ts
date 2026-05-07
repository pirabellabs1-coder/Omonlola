import { NextResponse } from "next/server";
import { getKey, setKey } from "@/lib/store";
import { logActivity } from "@/lib/activity";
import { STORE, type Settings } from "@/lib/types";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

const DEFAULT: Settings = {
  displayName: "Omonlola Admin",
  notifyEmail: "",
  whatsapp: "",
  seoTitle: "Omonlola AI | Meta Ads Specialist & Media Buyer",
  seoDescription:
    "Spécialiste Meta Ads et media buyer. Je transforme vos campagnes pour attirer, retenir et convertir grâce à des systèmes d'acquisition pilotés par la data.",
  seoKeywords: "meta ads, media buyer, roas, capi, e-commerce, saas, lead generation",
  seoOgImage: "",
  seoSiteUrl: ""
};

function s(v: unknown, fb = ""): string {
  return (v == null ? fb : String(v)).trim();
}

export async function GET() {
  const unauth = await requireAuth();
  if (unauth) return unauth;
  const data = await getKey<Settings>(STORE.settings, DEFAULT);
  // Make sure new fields exist on previously-saved settings
  return NextResponse.json({ ...DEFAULT, ...data });
}

export async function PUT(request: Request) {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  let body: Partial<Settings>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const current = { ...DEFAULT, ...(await getKey<Settings>(STORE.settings, DEFAULT)) };
  const merged: Settings = {
    displayName: s(body.displayName, current.displayName) || DEFAULT.displayName,
    notifyEmail: s(body.notifyEmail, current.notifyEmail),
    whatsapp: s(body.whatsapp, current.whatsapp).replace(/[^0-9]/g, ""),
    seoTitle: s(body.seoTitle, current.seoTitle) || DEFAULT.seoTitle,
    seoDescription: s(body.seoDescription, current.seoDescription) || DEFAULT.seoDescription,
    seoKeywords: s(body.seoKeywords, current.seoKeywords),
    seoOgImage: s(body.seoOgImage, current.seoOgImage),
    seoSiteUrl: s(body.seoSiteUrl, current.seoSiteUrl)
  };
  await setKey<Settings>(STORE.settings, merged);
  await logActivity("Paramètres mis à jour", merged.displayName);
  return NextResponse.json(merged);
}
