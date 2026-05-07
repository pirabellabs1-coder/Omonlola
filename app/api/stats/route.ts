import { NextResponse } from "next/server";
import { listAll } from "@/lib/store";
import { requireAuth } from "@/lib/auth";
import {
  STORE,
  type CaseItem,
  type FaqItem,
  type Lead,
  type PricingPlan,
  type Review,
  type TrackEvent
} from "@/lib/types";

export const dynamic = "force-dynamic";

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function dayKey(d: Date) {
  return startOfDay(d).toISOString().slice(0, 10);
}
function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function lastNDays(n: number) {
  const out: { key: string; label: string; date: Date }[] = [];
  const today = startOfDay(new Date());
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    out.push({
      key: dayKey(d),
      label: d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }),
      date: d
    });
  }
  return out;
}
function lastNMonths(n: number) {
  const out: { key: string; label: string; from: Date; to: Date }[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const from = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const to = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    out.push({
      key: monthKey(from),
      label: from.toLocaleDateString("fr-FR", { month: "short" }),
      from,
      to
    });
  }
  return out;
}
function isoWeek(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function classifyReferrer(ref?: string): string {
  if (!ref) return "Direct";
  try {
    const url = new URL(ref);
    const host = url.hostname.toLowerCase();
    if (/(facebook|instagram|fb\.|fbclid|meta)/.test(host)) return "Meta Ads";
    if (/(google|googleadservices|doubleclick)/.test(host)) return "Google";
    if (/(linkedin)/.test(host)) return "LinkedIn";
    if (/(twitter|t\.co|x\.com)/.test(host)) return "Twitter / X";
    if (/(youtube)/.test(host)) return "YouTube";
    if (/(tiktok)/.test(host)) return "TikTok";
    return "Referral";
  } catch {
    return "Direct";
  }
}

function refDomain(ref?: string): string | null {
  if (!ref) return null;
  try {
    return new URL(ref).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function classifyDevice(ua?: string): "Mobile" | "Tablet" | "Desktop" | "Bot" {
  if (!ua) return "Desktop";
  const u = ua.toLowerCase();
  if (/(bot|crawler|spider|slurp|baidu|yandex)/.test(u)) return "Bot";
  if (/ipad|tablet/.test(u)) return "Tablet";
  if (/mobile|iphone|ipod|android.*mobile|opera mini|blackberry/.test(u)) return "Mobile";
  return "Desktop";
}

function topN<T>(map: Map<T, number>, n: number) {
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([key, value]) => ({ key, value }));
}

export async function GET() {
  const unauth = await requireAuth();
  if (unauth) return unauth;
  const [leads, cases, reviews, faq, pricing, track] = await Promise.all([
    listAll<Lead>(STORE.leads),
    listAll<CaseItem>(STORE.cases),
    listAll<Review>(STORE.reviews),
    listAll<FaqItem>(STORE.faq),
    listAll<PricingPlan>(STORE.pricing),
    listAll<TrackEvent>(STORE.track)
  ]);

  // ===== Daily traffic (last 30 days) =====
  const days = lastNDays(30);
  const visitsPerDay = new Map<string, number>();
  for (const t of track) {
    if (t.kind !== "view") continue;
    const k = dayKey(new Date(t.at));
    visitsPerDay.set(k, (visitsPerDay.get(k) ?? 0) + 1);
  }
  const leadsPerDay = new Map<string, number>();
  for (const l of leads) {
    const k = dayKey(new Date(l.receivedAt));
    leadsPerDay.set(k, (leadsPerDay.get(k) ?? 0) + 1);
  }
  const traffic = days.map((d) => ({
    label: d.label,
    visits: visitsPerDay.get(d.key) ?? 0,
    leads: leadsPerDay.get(d.key) ?? 0
  }));

  // ===== 12-month traffic / leads / conversions =====
  const months = lastNMonths(12);
  const traffic12m = months.map((m) => {
    const visits = track.filter(
      (t) => t.kind === "view" && new Date(t.at) >= m.from && new Date(t.at) < m.to
    ).length;
    const monthLeads = leads.filter(
      (l) => new Date(l.receivedAt) >= m.from && new Date(l.receivedAt) < m.to
    );
    const conversions = monthLeads.filter((l) => l.status === "won").length;
    return { label: m.label, visits, leads: monthLeads.length, conversions };
  });

  // ===== Budget distribution =====
  const budgetCount = new Map<string, number>();
  for (const l of leads) {
    const k = l.budget || "Non précisé";
    budgetCount.set(k, (budgetCount.get(k) ?? 0) + 1);
  }
  const budgets = Array.from(budgetCount.entries()).map(([label, value]) => ({ label, value }));

  // ===== Sources of traffic (parsed from referrer) =====
  const sourceCount = new Map<string, number>();
  const refDomainCount = new Map<string, number>();
  const pageCount = new Map<string, number>();
  const deviceCount = new Map<string, number>();
  const sessionsSeen = new Set<string>();
  const sessionPageCount = new Map<string, number>();

  for (const t of track) {
    if (t.kind !== "view") continue;
    sourceCount.set(classifyReferrer(t.referrer), (sourceCount.get(classifyReferrer(t.referrer)) ?? 0) + 1);
    const dom = refDomain(t.referrer);
    if (dom) refDomainCount.set(dom, (refDomainCount.get(dom) ?? 0) + 1);
    const path = (t.path ?? "/").split("?")[0].split("#")[0] || "/";
    pageCount.set(path, (pageCount.get(path) ?? 0) + 1);
    const dev = classifyDevice(t.ua);
    deviceCount.set(dev, (deviceCount.get(dev) ?? 0) + 1);
    if (t.sessionId) {
      sessionsSeen.add(t.sessionId);
      sessionPageCount.set(t.sessionId, (sessionPageCount.get(t.sessionId) ?? 0) + 1);
    }
  }
  const sources = Array.from(sourceCount.entries()).map(([label, value]) => ({ label, value }));
  const topPages = topN(pageCount, 8).map((d) => ({ label: d.key, value: d.value }));
  const topReferrers = topN(refDomainCount, 8).map((d) => ({ label: d.key, value: d.value }));
  const devices = Array.from(deviceCount.entries()).map(([label, value]) => ({ label, value }));

  // Bounce rate = % of sessions with exactly 1 page view
  const totalSessions = sessionsSeen.size;
  const oneViewSessions = Array.from(sessionPageCount.values()).filter((c) => c === 1).length;
  const bounceRate = totalSessions ? Math.round((oneViewSessions / totalSessions) * 1000) / 10 : 0;

  // ===== Performance par source (CPL/CPA approximatif depuis budget moyen) =====
  // We can derive from leads' classified referrer if track sessions match. Simplify:
  // For each source, count leads attributed (best-effort via sessionId matching)
  const sessionToSource = new Map<string, string>();
  for (const t of track) {
    if (t.kind === "view" && t.sessionId) {
      sessionToSource.set(t.sessionId, classifyReferrer(t.referrer));
    }
  }
  const leadsBySource = new Map<string, number>();
  for (const l of leads) {
    // We do not have session tracking on lead submissions yet; approximate by 1 lead = 1 source bucket
    // Use the first known visiting source as a fallback bucket "Direct"
    leadsBySource.set("Direct", (leadsBySource.get("Direct") ?? 0) + 1);
  }
  const sourcesPerf = Array.from(sourceCount.keys())
    .slice(0, 5)
    .map((src) => {
      const visits = sourceCount.get(src) ?? 0;
      const lcount = leadsBySource.get(src) ?? 0;
      const rate = visits ? Math.round((lcount / visits) * 1000) / 10 : 0;
      return { label: src, visits, leads: lcount, rate };
    });

  // ===== Funnel =====
  const totalVisits = track.filter((t) => t.kind === "view").length;
  const visitsContact = track.filter(
    (t) => t.kind === "view" && (t.path?.includes("#contact") || t.path === "/#contact")
  ).length;
  const formSubmissions = leads.length;
  const qualifiedLeads = leads.filter((l) => l.status === "in-progress" || l.status === "won").length;
  const funnel = [
    { label: "Visites", value: totalVisits },
    { label: "Section contact", value: visitsContact },
    { label: "Formulaire envoyé", value: formSubmissions },
    { label: "Lead qualifié", value: qualifiedLeads }
  ];

  // ===== Weekly leads (8 weeks) =====
  const weeks: { label: string; leads: number }[] = [];
  const today = new Date();
  for (let i = 7; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i * 7);
    const key = isoWeek(d);
    const count = leads.filter((l) => isoWeek(new Date(l.receivedAt)) === key).length;
    weeks.push({ label: `S${key.split("-W")[1]}`, leads: count });
  }

  // ===== Conversion rate per month (last 6 months) =====
  const conv: { label: string; rate: number }[] = [];
  const months6 = lastNMonths(6);
  for (const m of months6) {
    const visits = track.filter(
      (t) => t.kind === "view" && new Date(t.at) >= m.from && new Date(t.at) < m.to
    ).length;
    const monthLeads = leads.filter(
      (l) => new Date(l.receivedAt) >= m.from && new Date(l.receivedAt) < m.to
    ).length;
    const rate = visits ? (monthLeads / visits) * 100 : 0;
    conv.push({ label: m.label, rate: Math.round(rate * 100) / 100 });
  }

  // ===== Totals =====
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  const leadsLastMonth = leads.filter((l) => new Date(l.receivedAt) >= monthAgo).length;
  const visitsLastMonth = track.filter((t) => t.kind === "view" && new Date(t.at) >= monthAgo).length;
  const overallRate = visitsLastMonth ? (leadsLastMonth / visitsLastMonth) * 100 : 0;

  return NextResponse.json({
    totals: {
      leadsAll: leads.length,
      leadsLastMonth,
      visitsAll: track.filter((t) => t.kind === "view").length,
      visitsLastMonth,
      conversionRate: Math.round(overallRate * 100) / 100,
      cases: cases.length,
      casesPublished: cases.filter((c) => c.published).length,
      reviews: reviews.length,
      reviewsPublished: reviews.filter((r) => r.published).length,
      faq: faq.length,
      faqPublished: faq.filter((f) => f.published).length,
      pricing: pricing.length,
      pricingPublished: pricing.filter((p) => p.published).length
    },
    traffic,
    traffic12m,
    budgets,
    sources,
    sourcesPerf,
    funnel,
    weeks,
    conversion: conv,
    seo: {
      topPages,
      topReferrers,
      devices,
      sessions: totalSessions,
      bounceRate,
      events: aggregateEvents(track)
    }
  });
}

function aggregateEvents(events: TrackEvent[]) {
  const counts = new Map<string, number>();
  for (const e of events) {
    if (e.kind !== "event" || !e.name) continue;
    counts.set(e.name, (counts.get(e.name) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value }));
}
