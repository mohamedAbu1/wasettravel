"use client";
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer/Footer";
import EgyptianBackground from "@/components/trips/EgyptianBackground";
import LoginModal from "@/components/home/components/LoginModal";
import SignUpButton from "@/components/home/components/SignUpButton";

// استدعاء الأقسام الجديدة
import AboutHero from "@/components/about/AboutHero";
import MissionValues from "@/components/about/MissionValues";
import StatsSection from "@/components/about/StatsSection";
import HeritageSection from "@/components/about/HeritageSection";
import CTASection from "@/components/about/CTASection";

export default function AboutPage() {
  const { theme } = useTheme();

  return (
    <main className={`relative w-full min-h-screen ${theme.background} ${theme.text} overflow-hidden pt-10`}>
      <Header />
      <EgyptianBackground />

      {/* الأقسام */}
      <AboutHero />
      <MissionValues />
      <StatsSection />
      <HeritageSection />
      <CTASection />

      <Footer />
      <SignUpButton />
      <LoginModal />
    </main>
  );
}
