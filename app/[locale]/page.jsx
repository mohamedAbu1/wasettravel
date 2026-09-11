"use client";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/header/Header";
import CarBookingSection from "@/components/home/CarBookingSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import CitiesSection from "@/components/home/CitiesSection";
import HeroSection from "@/components/home/HeroSection";
import OurSection from "@/components/home/OurSection";
import TopTripsSection from "@/components/home/TopTripsSection";
import TopReviewsSection from "@/components/home/components/TopReviewsSection";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useMessages } from "@/context/MessageContext";
import dynamic from "next/dynamic";

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
          min-h-screen font-sans bg-white transition-colors duration-300
          overflow-hidden
        `}
      >
        <Header />

        {/* ================= HERO SECTION ================= */}
        <HeroSection />

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
