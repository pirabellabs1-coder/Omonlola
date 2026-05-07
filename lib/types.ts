export type LeadStatus = "new" | "in-progress" | "won" | "archived";

export type Lead = {
  id: number;
  receivedAt: string;
  type: "contact";
  name: string;
  email: string;
  budget: string;
  message: string;
  status: LeadStatus;
};

export type LeadMagnetEntry = {
  id: number;
  receivedAt: string;
  email: string;
};

export type Kpi = { name: string; value: string };

export type CaseSector = "E-commerce" | "SaaS & B2B" | "Info-produit" | "Coaching";

export type CaseItem = {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  client: string;
  sector: CaseSector;
  description: string;
  body: string; // long-form content (multi-paragraph) shown in the case-study modal
  image: string;
  icon: string; // lucide icon name
  kpis: Kpi[];
  published: boolean;
};

export type Review = {
  id: number;
  createdAt: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number; // 1-5
  content: string;
  published: boolean;
  source?: "manual" | "invited";
  requestId?: number;
};

export type ReviewRequest = {
  id: number;
  token: string;
  clientName: string;
  clientEmail: string;
  note: string;
  createdAt: string;
  submittedAt?: string;
  reviewId?: number;
};

export type FaqItem = {
  id: number;
  createdAt: string;
  updatedAt: string;
  question: string;
  answer: string;
  order: number;
  published: boolean;
};

export type PricingPlan = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  price: string; // free-form: "250€", "Dès 800€", "Sur devis"
  unit: string;  // free-form: "/ one-shot", "/ mois", ""
  features: string[];
  cta: string;
  ctaLink: string; // anchor or URL, e.g. "#contact"
  popular: boolean;
  order: number;
  published: boolean;
};

export type ActivityEntry = {
  id: number;
  at: string;
  action: string;
  target: string;
  details?: string;
};

export type TrackEvent = {
  id: number;
  at: string;
  path: string;
  referrer?: string;
  ua?: string;
  sessionId?: string;
  kind: "view" | "event";
  name?: string;
};

export type Settings = {
  displayName: string;
  notifyEmail: string;
  whatsapp: string;
  // SEO of the public homepage
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  seoOgImage: string;
  seoSiteUrl: string;
};

export const STORE = {
  leads: "leads",
  leadMagnet: "lead-magnet",
  cases: "cases",
  reviews: "reviews",
  reviewRequests: "review-requests",
  faq: "faq",
  pricing: "pricing",
  activity: "activity",
  track: "track",
  settings: "settings"
} as const;
