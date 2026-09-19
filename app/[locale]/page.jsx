"use client";
import Header from "@/components/header/Header";
import HeroSection from "@/components/home/HeroSection";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useMessages } from "@/context/MessageContext";
import dynamic from "next/dynamic";

const DeferredSection = ({ children, className = "" }) => (
  <div className={`min-h-24 w-full ${className}`}>{children}</div>
);

// Below-the-fold sections are split out of the initial bundle. They still render
// after hydration, but no longer make the hero wait for every carousel and card.
const DownloadAppSection = dynamic(
  () => import("@/components/home/components/DownloadAppSection"),
  { loading: () => <DeferredSection className="bg-[#121212]" /> },
);
const CategoriesSection = dynamic(() => import("@/components/home/CategoriesSection"), {
  ssr: true,
  loading: () => <DeferredSection className="bg-[#0f0f0f]" />,
});
const TopTripsSection = dynamic(() => import("@/components/home/TopTripsSection"), {
  ssr: true,
  loading: () => <DeferredSection className="bg-[#0f0f0f]" />,
});
const CitiesSection = dynamic(() => import("@/components/home/CitiesSection"), {
  ssr: true,
  loading: () => <DeferredSection className="bg-[#0f0f0f]" />,
});
const OurSection = dynamic(() => import("@/components/home/OurSection"), {
  ssr: true,
  loading: () => <DeferredSection className="bg-[#121212]" />,
});
const TopReviewsSection = dynamic(
  () => import("@/components/home/components/TopReviewsSection"),
  { loading: () => <DeferredSection className="bg-[#121212]" /> },
);
const CarBookingSection = dynamic(() => import("@/components/home/CarBookingSection"), {
  ssr: true,
  loading: () => <DeferredSection className="bg-[#0f0f0f]" />,
});
const Footer = dynamic(() => import("@/components/Footer/Footer"), {
  ssr: true,
  loading: () => <DeferredSection className="bg-[#121212]" />,
});

// ✅ Lazy load components غير حرجة
const ChatWidget = dynamic(() => import("@/components/layout/ChatWidget"), { ssr: false });
const CurrencySelector = dynamic(() => import("@/components/layout/CurrencySelector"), { ssr: false });
const AdminDashboardButton = dynamic(() => import("@/components/layout/AdminDashboardButton"), { ssr: false });
const AdminChatWindow = dynamic(() => import("@/components/layout/AdminChatWindow"), { ssr: false });
const LoginModal = dynamic(() => import("@/components/home/components/LoginModal"), { ssr: false });
const SignUpModal = dynamic(() => import("@/components/home/components/SignUpButton"), { ssr: false });

export default function Home() {
  const { userData, chatUser, setChatUser } = useAuth();
  const { lang } = useLanguage();
  const { messages } = useMessages();

  return (
    <>
      <main id="main-content" tabIndex={-1}
        className={`
          site-shell w-full flex flex-col items-center justify-center
          min-h-screen font-sans bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300
          overflow-hidden
        `}
      >
        <Header />

        {/* ================= HERO SECTION ================= */}
        <HeroSection />
        <div className="home-deferred-section"><DownloadAppSection /></div>

        <section
          id="discover"
          aria-labelledby="egypt-tourism-guide"
          className="stone-section w-full border-y border-[var(--line)] bg-[var(--surface)] px-5 py-12 text-[var(--foreground)] sm:px-8 sm:py-16"
        >
          <div className="mx-auto max-w-5xl">
            <p className="stone-kicker mb-3 text-sm font-semibold uppercase tracking-[0.22em]">
              WasetTravel Egypt travel guide
            </p>
            <h2 id="egypt-tourism-guide" className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
              Discover Egypt through Luxor, Aswan, and the Nile
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--muted)] sm:text-lg">
              Plan a richer Egypt holiday with local experiences in Luxor and Aswan. Explore ancient temples and tombs,
              enjoy Nile cruises between Upper Egypt destinations, and choose private tours designed around your time,
              comfort, and interests.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a className="stone-button rounded-xl px-5 py-3 font-semibold" href={`/${lang}/destinations/luxor`}>
                Luxor tours and temples
              </a>
              <a className="rounded-xl border border-[var(--color)] px-5 py-3 font-semibold text-[var(--foreground)] transition hover:bg-[var(--color)]/10" href={`/${lang}/destinations/aswan`}>
                Aswan tours and Nile trips
              </a>
              <a className="rounded-xl border border-[var(--line)] px-5 py-3 font-semibold text-[var(--foreground)] transition hover:border-[var(--color)]" href={`/${lang}/trips`}>
                Browse all Egypt tours
              </a>
            </div>
          </div>
        </section>

        {/* ================= CATEGORIES SECTION ================= */}
        <div className="home-deferred-section"><CategoriesSection /></div>

        {/* ================= TOP TRIPS SECTION ================= */}
        <div className="home-deferred-section"><TopTripsSection /></div>

        {/* ================= CITIES SECTION ================= */}
        <div className="home-deferred-section"><CitiesSection /></div>

        <div className="home-deferred-section"><OurSection /></div>
        <div className="home-deferred-section"><TopReviewsSection /></div>
        <div className="home-deferred-section"><CarBookingSection /></div>

        {/* ================= FOOTER ================= */}
        <div className="home-deferred-section"><Footer /></div>

        {/* ✅ Lazy loaded components */}
        <SignUpModal />
        <LoginModal />
        {userData && <ChatWidget />}
        {userData && <AdminDashboardButton />}
        {chatUser && (
          <AdminChatWindow
            user={chatUser}
            admin={userData}
            messages={messages}
            onClose={() => setChatUser(null)}
          />
        )}
        <CurrencySelector />
      </main>
    </>
  );
}
