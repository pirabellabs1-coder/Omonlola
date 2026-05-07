import "server-only";
import { getKey } from "./store";
import { STORE, type Settings } from "./types";

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

export async function getSettings(): Promise<Settings> {
  const data = await getKey<Settings>(STORE.settings, DEFAULT);
  return { ...DEFAULT, ...data };
}
