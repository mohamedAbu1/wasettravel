"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer/Footer";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import LoginModal from "@/components/home/components/LoginModal";
import AboutHero from "@/components/about/AboutHero";
import MissionValues from "@/components/about/MissionValues";
import StatsSection from "@/components/about/StatsSection";
import HeritageSection from "@/components/about/HeritageSection";
import CTASection from "@/components/about/CTASection";
import ChatWidget from "@/components/layout/ChatWidget";
import { useAuth } from "@/context/AuthContext";
import Head from "next/head";
import { useLanguage } from "@/context/LanguageContext";
import { aboutMetadata } from "@/lib/metadata/about";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import AdminDashboardButton from "@/components/layout/AdminDashboardButton";
import CurrencySelector from "@/components/layout/CurrencySelector";
import SignUpModal from "@/components/home/components/SignUpButton";

export default function AboutPage() {
  const { theme } = useTheme();
  const { userData } = useAuth();
  const { lang } = useLanguage();
  const meta = aboutMetadata[lang] || aboutMetadata.en;
  const router = useRouter();

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsSmallScreen(window.innerWidth <= 1024);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
      </Head>
      <main className="relative flex flex-col min-h-screen justify-center items-center">
        <Header />
        <EgyptianBackground />

        {isSmallScreen ? (
          // ✅ واجهة بديلة للهواتف والشاشات الصغيرة
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col items-center justify-center h-[70vh] text-center gap-6"
          >
            <h2 className="text-4xl font-extrabold text-[#c9a34a] drop-shadow-lg">
              🚫 This page is not available on phones.🚫
            </h2>
            <p className="text-lg text-gray-600">
              You should go to the homepage to follow your trips
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 rounded-lg bg-[#c9a34a] text-white font-bold shadow-lg hover:bg-yellow-600 transition"
            >
              Return to home page
            </button>
          </motion.div>
        ) : (
          // ✅ الأقسام العادية
          <>
            <AboutHero />
            <MissionValues />
            <StatsSection />
            <HeritageSection />
            <CTASection />
          </>
        )}

        <Footer />
        <SignUpModal />

        <LoginModal />
        {userData && <ChatWidget />}
        {userData && <AdminDashboardButton />}
        <CurrencySelector />
      </main>
    </>
  );
}
