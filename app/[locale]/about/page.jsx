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
import SeoHead from "@/components/layout/SeoHead";

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
      <SeoHead
        title={meta.title}
        description={meta.description}
        keywords={meta.keywords}
        image="/cover.jpg" // صورة افتراضية للصفحة
      />
      <main className="relative flex flex-col min-h-screen justify-center items-center">
        <Header />
        <EgyptianBackground />

        <>
          <AboutHero />
          <MissionValues />
          <StatsSection />
          <HeritageSection />
          <CTASection />
        </>

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
