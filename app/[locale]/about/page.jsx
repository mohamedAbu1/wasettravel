"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer/Footer";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import AboutHero from "@/components/about/AboutHero";
import MissionValues from "@/components/about/MissionValues";
import StatsSection from "@/components/about/StatsSection";
import HeritageSection from "@/components/about/HeritageSection";
import CTASection from "@/components/about/CTASection";
import { useLanguage } from "@/context/LanguageContext";
import dynamic from "next/dynamic";

// ✅ Lazy load components غير حرجة
const ChatWidget = dynamic(() => import("@/components/layout/ChatWidget"), { ssr: false });
const LoginModal = dynamic(() => import("@/components/home/components/LoginModal"), { ssr: false });
const SignUpModal = dynamic(() => import("@/components/home/components/SignUpButton"), { ssr: false });
const AdminDashboardButton = dynamic(() => import("@/components/layout/AdminDashboardButton"), { ssr: false });
const CurrencySelector = dynamic(() => import("@/components/layout/CurrencySelector"), { ssr: false });

export default function AboutPage() {
  const { theme } = useTheme();
  const { userData } = useAuth();
  const { lang } = useLanguage();

  return (
    <>
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
