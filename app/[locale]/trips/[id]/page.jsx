"use client";
import { useTrip } from "@/context/TripContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";
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

export default function TripPage({ params }) {
  const { id } = params; // ✅ استخدم params مباشرة بدل use()
  const { trips, fetchTrips, getTripById } = useTrip();
  const { lang } = useLanguage();
  const { themeName } = useTheme();
  const { user } = useAuth();
  const { purchases } = usePurchase();
  const router = useRouter();

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    if (!trips.length) {
      fetchTrips();
    }
  }, []);

  // ✅ مراقبة حجم الشاشة
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
        // ✅ التصميم العادي لصفحة الرحلة
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
              <TripCities trip={trip} lang={lang} />
              <TripCategories trip={trip} lang={lang} />
            </div>
            <TripVideo trip={trip} lang={lang} />
            <AccessibilityInfo theme="dark" />
          </div>

          <div className="col-span-3 flex flex-row gap-8">
            <TripIncludes trip={trip} lang={lang} />
          </div>

          <div className="col-span-1 lg:col-span-3">
            <TripItinerary trip={trip} lang={lang} />
          </div>

          <div className="col-span-1 lg:col-span-3">
            <TripReviews trip={trip} lang={lang} />
            {user &&
              (hasActivePurchase ? (
                <CancelButton trip={trip} />
              ) : (
                <PurchaseButton trip={trip} />
              ))}
          </div>
        </div>
      )}

      <Footer />
      <LoginModal />
      {user && <ChatWidget />}
    </main>
  );
}
