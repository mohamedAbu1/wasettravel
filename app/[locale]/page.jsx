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
      <main
        className={`
          w-full flex flex-col items-center justify-center
          min-h-screen font-sans bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300
          overflow-hidden
        `}
      >
        <Header />

        {/* ================= HERO SECTION ================= */}
        <HeroSection />
        <DownloadAppSection />

        <section
          aria-labelledby="egypt-tourism-guide"
          className="w-full border-y border-white/10 bg-[#121212] px-5 py-12 text-white sm:px-8 sm:py-16"
        >
          <div className="mx-auto max-w-5xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#c9a34a]">
              WasetTravel Egypt travel guide
            </p>
            <h2 id="egypt-tourism-guide" className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
              Discover Egypt through Luxor, Aswan, and the Nile
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-white/75 sm:text-lg">
              Plan a richer Egypt holiday with local experiences in Luxor and Aswan. Explore ancient temples and tombs,
              enjoy Nile cruises between Upper Egypt destinations, and choose private tours designed around your time,
              comfort, and interests.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a className="rounded-xl bg-[#c9a34a] px-5 py-3 font-semibold text-white transition hover:bg-[#a67c00]" href="/en/destinations/luxor">
                Luxor tours and temples
              </a>
              <a className="rounded-xl border border-[#c9a34a] px-5 py-3 font-semibold text-[#e6dcca] transition hover:bg-[#c9a34a]/10" href="/en/destinations/aswan">
                Aswan tours and Nile trips
              </a>
              <a className="rounded-xl border border-white/20 px-5 py-3 font-semibold text-white/85 transition hover:border-white/50" href="/en/trips">
                Browse all Egypt tours
              </a>
            </div>
          </div>
        </section>

        {/* ================= CATEGORIES SECTION ================= */}
        <CategoriesSection />

        {/* ================= TOP TRIPS SECTION ================= */}
        <TopTripsSection />

        {/* ================= CITIES SECTION ================= */}
        <CitiesSection />

        <OurSection />
        <TopReviewsSection />
        <CarBookingSection />

        {/* ================= FOOTER ================= */}
        <Footer />

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
