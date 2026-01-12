"use client";
import { useState } from "react";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/header/Header";
import CarBookingSection from "@/components/home/CarBookingSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import CitiesSection from "@/components/home/CitiesSection";
import HeroSection from "@/components/home/HeroSection";
import OurSection from "@/components/home/OurSection";
import TopTripsSection from "@/components/home/TopTripsSection";
import LoginModal from "@/components/home/components/LoginModal";
import SignUpButton from "@/components/home/components/SignUpButton";
import TopReviewsSection from "@/components/home/components/TopReviewsSection";
import ChatWidget from "@/components/home/components/ChatWidget";

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <main
      className={`
        min-h-screen font-sans
        bg-white
        transition-colors duration-300
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

      <SignUpButton />
      <LoginModal />

      {/* زر الدردشة السريعة */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 bg-yellow-500 text-black font-bold px-4 py-3 rounded-full shadow-lg hover:bg-yellow-600 transition"
      >
        💬
      </button>

      {/* نافذة الدردشة */}
      <ChatWidget />
    </main>
  );
}
