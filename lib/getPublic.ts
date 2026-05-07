import "server-only";
import { listAll } from "./store";
import { STORE, type CaseItem, type FaqItem, type PricingPlan, type Review } from "./types";

export async function getPublishedCases(): Promise<CaseItem[]> {
  const all = await listAll<CaseItem>(STORE.cases);
  return all.filter((c) => c.published);
}

export async function getPublishedReviews(): Promise<Review[]> {
  const all = await listAll<Review>(STORE.reviews);
  return all.filter((r) => r.published);
}

export async function getPublishedFaq(): Promise<FaqItem[]> {
  const all = await listAll<FaqItem>(STORE.faq);
  return all.filter((f) => f.published).sort((a, b) => a.order - b.order);
}

export async function getPublishedPricing(): Promise<PricingPlan[]> {
  const all = await listAll<PricingPlan>(STORE.pricing);
  return all.filter((p) => p.published).sort((a, b) => a.order - b.order);
}
