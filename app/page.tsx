import ClientChrome from "@/components/ClientChrome";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ToastProvider } from "@/components/Toast";
import Tracker from "@/components/Tracker";
import Compare from "@/components/sections/Compare";
import Contact from "@/components/sections/Contact";
import FAQ from "@/components/sections/FAQ";
import Hero from "@/components/sections/Hero";
import LeadMagnet from "@/components/sections/LeadMagnet";
import Manifesto from "@/components/sections/Manifesto";
import Portfolio from "@/components/sections/Portfolio";
import Power from "@/components/sections/Power";
import Pricing from "@/components/sections/Pricing";
import Problem from "@/components/sections/Problem";
import Process from "@/components/sections/Process";
import Qualification from "@/components/sections/Qualification";
import Reviews from "@/components/sections/Reviews";
import RoiCalculator from "@/components/sections/RoiCalculator";
import Services from "@/components/sections/Services";
import VideoSection from "@/components/sections/VideoSection";
import {
  getPublishedCases,
  getPublishedFaq,
  getPublishedPricing,
  getPublishedReviews
} from "@/lib/getPublic";
import { getSettings } from "@/lib/getSettings";

// Always re-render at request time so admin changes (publish, edit, delete)
// reflect immediately on the homepage.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const [cases, reviews, faq, pricing, settings] = await Promise.all([
    getPublishedCases(),
    getPublishedReviews(),
    getPublishedFaq(),
    getPublishedPricing(),
    getSettings()
  ]);

  return (
    <ToastProvider>
      <Tracker />
      <ClientChrome />
      <Navbar />
      <main>
        <Hero />
        {/* Section vidéo demandée — juste après le Hero */}
        <VideoSection />
        <Problem />
        <Manifesto />
        <Power />
        <Services />
        <RoiCalculator />
        <Process />
        {/* Réalisations — pilotées par l'admin */}
        <Portfolio items={cases} />
        <Compare />
        <Qualification />
        {/* Tarifs — pilotés par l'admin */}
        <Pricing items={pricing} />
        {/* Témoignages — pilotés par l'admin */}
        <Reviews items={reviews} />
        {/* FAQ — pilotée par l'admin */}
        <FAQ items={faq} />
        <LeadMagnet />
        <Contact whatsapp={settings.whatsapp || undefined} />
      </main>
      <Footer />
    </ToastProvider>
  );
}
