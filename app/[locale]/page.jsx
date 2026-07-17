"use client";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/header/Header";
import CarBookingSection from "@/components/home/CarBookingSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import CitiesSection from "@/components/home/CitiesSection";
import HeroSection from "@/components/home/HeroSection";
import OurSection from "@/components/home/OurSection";
import TopTripsSection from "@/components/home/TopTripsSection";
import LoginModal from "@/components/home/components/LoginModal";
import TopReviewsSection from "@/components/home/components/TopReviewsSection";
import ChatWidget from "@/components/layout/ChatWidget";
import { useAuth } from "@/context/AuthContext"; 
import Head from "next/head";
import { useLanguage } from "@/context/LanguageContext";
import { homeMetadata } from "@/lib/metadata/home";
import CurrencySelector from "@/components/layout/CurrencySelector";
import AdminDashboardButton from "@/components/layout/AdminDashboardButton";
import SignUpModal from "@/components/home/components/SignUpButton";
import { useEffect, useState } from "react";

export default function Home() {
  const { userData } = useAuth(); // ✅ جلب المستخدم الحالي من الـ API
  const { lang } = useLanguage();
  const meta = homeMetadata[lang] || homeMetadata.en;
  const [dbStatus, setDbStatus] = useState(null);

  useEffect(() => {
    async function checkConnection() {
      const res = await fetch("/api/testConnection");
      const data = await res.json();
      setDbStatus(data);
    }
    checkConnection();
  }, []);

  // ✅ دمج بيانات المستخدم من AuthContext و NextAuth

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
      </Head>
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
        <SignUpModal />
        <LoginModal />

        {/* نافذة الدردشة تظهر فقط لو المستخدم مسجل دخول */}
        {userData && <ChatWidget />}
        {userData && <AdminDashboardButton />}
        <CurrencySelector />
      </main>
    </>
  );
}
