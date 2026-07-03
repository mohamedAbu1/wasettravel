"use client";
import React, { use, useEffect, useState } from "react";
import { useTrip } from "@/context/TripContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/header/Header";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import LoginModal from "@/components/home/components/LoginModal";
import TripHeader from "./components/TripHeader";
import TripCities from "./components/TripCities";
import TripCategories from "./components/TripCategories";
import TripIncludes from "./components/TripIncludes";
import TripItinerary from "./components/TripItinerary";
import TripInfo from "./components/TripInfo";
import TripReviews from "./components/TripReviews";
import ChatWidget from "@/components/layout/ChatWidget";
import { useAuth } from "@/context/AuthContext";
import PurchaseButton from "./components/PurchaseButton";
import CancelButton from "./components/CancelButton";
import TripVideo from "./components/TripVideo";
import { usePurchase } from "@/context/PurchaseContext";
import AccessibilityInfo from "./components/components/AccessibilityInfo";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import SignUpModal from "@/components/home/components/SignUpButton";

export default function TripPage({ params }) {
  const { trips, fetchTrips, getTripById } = useTrip();
  const { lang } = useLanguage();
  const { themeName } = useTheme();
  const { user } = useAuth();
  const { purchases } = usePurchase();
  const router = useRouter();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // ✅ فك الـ params بشكل صحيح
  const { id } = use(params);

  useEffect(() => {
    if (!trips.length) {
      fetchTrips();
    }
  }, [trips, fetchTrips]);

  useEffect(() => {
    const checkScreen = () => setIsSmallScreen(window.innerWidth <= 1024);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const trip = getTripById(id);
  if (!trip) {
    return <p>Trip not found</p>;
  }

const localizedTrip = {
  ...trip,
  title: trip.title?.[lang] || trip.title?.en,
  description: trip.description?.[lang] || trip.description?.en,
  cities: Array.isArray(trip.cities)
    ? trip.cities.map(c => (typeof c === "object" ? c?.[lang] || c?.en : c))
    : typeof trip.cities === "object"
      ? trip.cities?.[lang] || trip.cities?.en
      : trip.cities,
  categories: Array.isArray(trip.categories)
    ? trip.categories.map(cat => (typeof cat === "object" ? cat?.[lang] || cat?.en : cat))
    : typeof trip.categories === "object"
      ? trip.categories?.[lang] || trip.categories?.en
      : trip.categories,
  includes: Array.isArray(trip.includes)
    ? trip.includes.map(i => (typeof i === "object" ? i?.[lang] || i?.en : i))
    : typeof trip.includes === "object"
      ? trip.includes?.[lang] || trip.includes?.en
      : trip.includes,
  itinerary: Array.isArray(trip.itinerary)
    ? trip.itinerary.map(it => (typeof it === "object" ? it?.[lang] || it?.en : it))
    : typeof trip.itinerary === "object"
      ? trip.itinerary?.[lang] || trip.itinerary?.en
      : trip.itinerary,
};





  const hasActivePurchase = purchases.some(
    (p) =>
      p.trip_id === trip.id &&
      p.user_id === user?.id &&
      p.status !== "Cancelled",
  );

  return (
    <main
      className={`min-h-screen ${
        themeName === "dark"
          ? "bg-gradient-to-b from-black via-gray-900 to-black text-gold"
          : "bg-gradient-to-b from-[#fdf6e3] via-[#f5deb3] to-[#fdf6e3] text-[#3a2c0a]"
      }`}
    >
      <Header />
      <EgyptianBackground />

      {isSmallScreen ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center justify-center h-[70vh] text-center gap-6"
        >
          <h2 className="text-4xl font-extrabold text-[#c9a34a] drop-shadow-lg">
            🚫 This page is not available on phones. 🚫
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
        <div
          style={{ paddingTop: "110px" }}
          className="max-w-7xl mx-auto p-6 relative z-10 grid gap-8 
             grid-cols-1 lg:grid-cols-2 auto-rows-min"
        >
          <div className="col-span-1 lg:col-span-3">
            <TripHeader trip={trip} lang={lang} />
          </div>

          <div className="col-span-3 flex flex-row gap-8">
            <div className="col-span-3 flex flex-col gap-2.5">
              <TripInfo trip={trip} lang={lang} />
              <TripCities trip={localizedTrip} lang={lang} />
              <TripCategories trip={localizedTrip} lang={lang} />
            </div>
            <TripVideo trip={localizedTrip} lang={lang} />
            <AccessibilityInfo theme="dark" />
          </div>

          <div className="col-span-3 flex flex-row gap-8">
            <TripIncludes trip={trip} lang={lang} />
          </div>

          <div className="col-span-1 lg:col-span-3">
            <TripItinerary trip={localizedTrip} lang={lang} />
          </div>

          <div className="col-span-1 lg:col-span-3">
            <TripReviews trip={localizedTrip} lang={lang} />
            {user &&
              (hasActivePurchase ? (
                <CancelButton trip={localizedTrip} />
              ) : (
                <PurchaseButton trip={localizedTrip} />
              ))}
          </div>
        </div>
      )}

      <Footer />
      <SignUpModal />
      <LoginModal />
      {user && <ChatWidget />}
    </main>
  );
}
