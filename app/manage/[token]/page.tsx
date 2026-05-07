"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ExternalLink, Loader2, Menu, ShieldCheck } from "lucide-react";
import Sidebar, { type AdminPage } from "@/components/admin/Sidebar";
import OverviewPage from "@/components/admin/OverviewPage";
import AnalyticsPage from "@/components/admin/AnalyticsPage";
import LeadsPage from "@/components/admin/LeadsPage";
import CasesPage from "@/components/admin/CasesPage";
import ReviewsPage from "@/components/admin/ReviewsPage";
import FaqPage from "@/components/admin/FaqPage";
import PricingPage from "@/components/admin/PricingPage";
import ActivityPage from "@/components/admin/ActivityPage";
import SettingsPage from "@/components/admin/SettingsPage";
import SearchDropdown from "@/components/admin/SearchDropdown";
import NotificationsDropdown from "@/components/admin/NotificationsDropdown";
import { ToastProvider, useToast } from "@/components/Toast";
import { ConfirmProvider } from "@/components/admin/Confirm";
import { apiStats } from "@/components/admin/api";

export default function ManagePage() {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <AdminInner />
      </ConfirmProvider>
    </ToastProvider>
  );
}

function AdminInner() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  const refreshAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (!res.ok) {
        setAuthed(false);
        return;
      }
      const data = await res.json();
      setAuthed(Boolean(data.authed));
    } catch {
      setAuthed(false);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  if (authed === null) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-brand animate-spin" />
      </div>
    );
  }

  return authed ? (
    <Dashboard onLogout={() => setAuthed(false)} />
  ) : (
    <LoginView onSuccess={() => setAuthed(true)} />
  );
}

function LoginView({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: email, password })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "Identifiants invalides.");
        return;
      }
      onSuccess();
    } catch {
      setError("Connexion impossible.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-dark relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/10 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="w-full flex justify-center items-center p-6 relative z-10">
        <div className="w-full max-w-md glass-panel p-10 shadow-[0_0_50px_rgba(0,102,255,0.05)] !border-brand/20">
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-brand/10 border border-brand/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-brand" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">Espace Administration</h2>
          <p className="text-text-muted text-sm text-center mb-8">
            Accès restreint — connectez-vous pour gérer votre site.
          </p>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full input-style rounded-lg px-4 py-3 text-sm"
                placeholder="admin@…"
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full input-style rounded-lg px-4 py-3 text-sm"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={pending}
              className="w-full bg-brand text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-light transition-colors mt-4 shadow-[0_0_15px_rgba(0,102,255,0.4)] flex justify-center items-center gap-2 disabled:opacity-60"
            >
              {pending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Connexion…
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [page, setPage] = useState<AdminPage>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [badges, setBadges] = useState<Partial<Record<AdminPage, number>>>({});
  const toast = useToast();

  const refreshBadges = useCallback(async () => {
    try {
      const s = await apiStats();
      setBadges({
        leads: s.totals.leadsAll,
        cases: s.totals.cases,
        reviews: s.totals.reviews,
        faq: s.totals.faq,
        pricing: s.totals.pricing
      });
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    refreshBadges();
    const id = setInterval(refreshBadges, 20_000);
    return () => clearInterval(id);
  }, [refreshBadges, page]);

  // Auto-scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const titles: Record<AdminPage, string> = {
    overview: "Vue d'ensemble",
    analytics: "Analytics",
    leads: "Boîte de réception",
    cases: "Réalisations",
    reviews: "Témoignages",
    faq: "FAQ",
    pricing: "Tarifs / Offres",
    activity: "Journal d'activité",
    settings: "Paramètres"
  };

  async function logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // even if it fails server-side, drop UI state
    }
    toast("Déconnecté.", "check");
    onLogout();
  }

  return (
    <div className="min-h-screen bg-dark admin-root">
      <Sidebar
        current={page}
        onSelect={setPage}
        badges={badges}
        onLogout={logout}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="md:pl-64">
        <header className="sticky top-0 z-30 h-20 bg-dark/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-text-muted hover:text-white"
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-white">{titles[page]}</h1>
          </div>

          <div className="flex items-center gap-3">
            <SearchDropdown onJump={(p) => setPage(p)} />
            <NotificationsDropdown onJump={(p) => setPage(p)} />
            <Link
              href="/"
              target="_blank"
              className="hidden md:flex px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-white hover:bg-white/10 items-center gap-2 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-text-muted" /> Voir le site
            </Link>
          </div>
        </header>

        <div className="p-4 md:p-8">
          {page === "overview" && <OverviewPage onSeeLeads={() => setPage("leads")} />}
          {page === "analytics" && <AnalyticsPage />}
          {page === "leads" && <LeadsPage />}
          {page === "cases" && <CasesPage />}
          {page === "reviews" && <ReviewsPage />}
          {page === "faq" && <FaqPage />}
          {page === "pricing" && <PricingPage />}
          {page === "activity" && <ActivityPage />}
          {page === "settings" && <SettingsPage />}
        </div>
      </div>
    </div>
  );
}
