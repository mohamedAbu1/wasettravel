"use client";
import CategoriesSection from "@/components/CategoriesSection";
import CitiesSection from "@/components/CitiesSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TopTripsSection from "@/components/TopTripsSection";
import { useTheme } from "@/context/ThemeContext";

export default function Home() {
  const { theme } = useTheme();

  return (
    <main
      className={`
        min-h-screen font-sans
       bg-white
        transition-colors duration-300
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

      {/* ================= FOOTER ================= */}
      <Footer />
    </main>
  );
}
