"use client";

import type {
  ActivityEntry,
  CaseItem,
  FaqItem,
  Lead,
  LeadStatus,
  PricingPlan,
  Review,
  ReviewRequest,
  Settings
} from "@/lib/types";

export type Stats = {
  totals: {
    leadsAll: number;
    leadsLastMonth: number;
    visitsAll: number;
    visitsLastMonth: number;
    conversionRate: number;
    cases: number;
    casesPublished: number;
    reviews: number;
    reviewsPublished: number;
    faq: number;
    faqPublished: number;
    pricing: number;
    pricingPublished: number;
  };
  traffic: { label: string; visits: number; leads: number }[];
  traffic12m: { label: string; visits: number; leads: number; conversions: number }[];
  budgets: { label: string; value: number }[];
  sources: { label: string; value: number }[];
  sourcesPerf: { label: string; visits: number; leads: number; rate: number }[];
  funnel: { label: string; value: number }[];
  weeks: { label: string; leads: number }[];
  conversion: { label: string; rate: number }[];
  seo: {
    topPages: { label: string; value: number }[];
    topReferrers: { label: string; value: number }[];
    devices: { label: string; value: number }[];
    sessions: number;
    bounceRate: number;
    events: { label: string; value: number }[];
  };
};

async function http<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    cache: "no-store",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    ...init
  });
  if (res.status === 401) {
    // Session expired or missing — force a refresh so the login screen kicks in
    if (typeof window !== "undefined") window.location.reload();
    throw new Error("Session expirée");
  }
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      if (data?.error) msg = data.error;
    } catch {}
    throw new Error(msg);
  }
  return (await res.json()) as T;
}

// Leads
export const apiListLeads = () => http<Lead[]>("/api/contact");
export const apiUpdateLead = (id: number, status: LeadStatus) =>
  http<Lead>(`/api/contact/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
export const apiDeleteLead = (id: number) => http<{ ok: true }>(`/api/contact/${id}`, { method: "DELETE" });

// Cases
export const apiListCases = () => http<CaseItem[]>("/api/cases");
export const apiCreateCase = (data: Partial<CaseItem>) =>
  http<CaseItem>("/api/cases", { method: "POST", body: JSON.stringify(data) });
export const apiUpdateCase = (id: number, data: Partial<CaseItem>) =>
  http<CaseItem>(`/api/cases/${id}`, { method: "PATCH", body: JSON.stringify(data) });
export const apiDeleteCase = (id: number) => http<{ ok: true }>(`/api/cases/${id}`, { method: "DELETE" });

// Reviews
export const apiListReviews = () => http<Review[]>("/api/reviews");
export const apiCreateReview = (data: Partial<Review>) =>
  http<Review>("/api/reviews", { method: "POST", body: JSON.stringify(data) });
export const apiUpdateReview = (id: number, data: Partial<Review>) =>
  http<Review>(`/api/reviews/${id}`, { method: "PATCH", body: JSON.stringify(data) });
export const apiDeleteReview = (id: number) => http<{ ok: true }>(`/api/reviews/${id}`, { method: "DELETE" });

// Review invitation requests
export const apiListReviewRequests = () => http<ReviewRequest[]>("/api/reviews/requests");
export const apiCreateReviewRequest = (data: { clientName: string; clientEmail?: string; note?: string }) =>
  http<ReviewRequest & { url: string }>("/api/reviews/requests", {
    method: "POST",
    body: JSON.stringify(data)
  });
export const apiDeleteReviewRequest = (id: number) =>
  http<{ ok: true }>(`/api/reviews/requests/${id}`, { method: "DELETE" });

// FAQ
export const apiListFaq = () => http<FaqItem[]>("/api/faq");
export const apiCreateFaq = (data: Partial<FaqItem>) =>
  http<FaqItem>("/api/faq", { method: "POST", body: JSON.stringify(data) });
export const apiUpdateFaq = (id: number, data: Partial<FaqItem>) =>
  http<FaqItem>(`/api/faq/${id}`, { method: "PATCH", body: JSON.stringify(data) });
export const apiDeleteFaq = (id: number) => http<{ ok: true }>(`/api/faq/${id}`, { method: "DELETE" });

// Pricing plans
export const apiListPricing = () => http<PricingPlan[]>("/api/pricing");
export const apiCreatePricing = (data: Partial<PricingPlan>) =>
  http<PricingPlan>("/api/pricing", { method: "POST", body: JSON.stringify(data) });
export const apiUpdatePricing = (id: number, data: Partial<PricingPlan>) =>
  http<PricingPlan>(`/api/pricing/${id}`, { method: "PATCH", body: JSON.stringify(data) });
export const apiDeletePricing = (id: number) =>
  http<{ ok: true }>(`/api/pricing/${id}`, { method: "DELETE" });

// Activity, stats, settings
export const apiActivity = () => http<ActivityEntry[]>("/api/activity");
export const apiStats = () => http<Stats>("/api/stats");
export const apiGetSettings = () => http<Settings>("/api/settings");
export const apiPutSettings = (data: Partial<Settings>) =>
  http<Settings>("/api/settings", { method: "PUT", body: JSON.stringify(data) });
