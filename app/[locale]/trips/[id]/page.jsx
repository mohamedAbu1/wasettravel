"use client";
import { useTrip } from "@/context/TripContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useEffect, useMemo } from "react";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/header/Header";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import TripHeader from "./components/TripHeader";
import TripCities from "./components/TripCities";
import TripCategories from "./components/TripCategories";
import TripIncludes from "./components/TripIncludes";
import TripItinerary from "./components/TripItinerary";
import TripReviews from "./components/TripReviews";
import CancelButton from "./components/CancelButton";
import AccessibilityInfo from "./components/components/AccessibilityInfo";
import TripExclusions from "./components/TripExclusions";
import CalendarWidget from "./components/CalendarWidget";
import TripOverviewTable from "./components/TripOverviewTable";
import { useAuth } from "@/context/AuthContext";
import { usePurchase } from "@/context/PurchaseContext";
import { useTranslation } from "react-i18next";
import SeoHead from "@/components/layout/SeoHead";
import dynamic from "next/dynamic";

// ✅ Lazy load components غير حرجة
const ChatWidget = dynamic(() => import("@/components/layout/ChatWidget"), { ssr: false });
const AdminChatWindow = dynamic(() => import("@/components/layout/AdminChatWindow"), { ssr: false });
const LoginModal = dynamic(() => import("@/components/home/components/LoginModal"), { ssr: false });
const SignUpButton = dynamic(() => import("@/components/home/components/SignUpButton"), { ssr: false });

export default function TripPage({ params }) {
  const { id } = params;
  const { trips, fetchTrips, getTripById } = useTrip();
  const { lang } = useLanguage();
  const { theme, themeName } = useTheme();
  const { userData, chatUser, setChatUser } = useAuth();
  const { purchases } = usePurchase();
  const { t } = useTranslation("header");

  useEffect(() => {
    if (!trips.length) {
      fetchTrips();
    }
  }, []);

  // ✅ Memoized trip
  const trip = useMemo(() => getTripById(id), [id, trips]);

  if (!trip) {
    return <p className={`${theme.text}`}>Trip not found</p>;
  }

  const hasActivePurchase = purchases.some(
    (p) =>
      p.trip_id === trip.id &&
      p.user_id === userData?.id &&
      p.status !== "Cancelled",
  );

  return (
    <>
      <SeoHead
        title={trip.title?.[lang] || trip.title?.en}
        description={trip.description?.[lang] || trip.description?.en}
        image={trip.cover_image || "/cover.jpg"}
      />

      <main className={`min-h-screen relative ${theme.text}`}>
        <Header />
        <EgyptianBackground />

        {/* ✅ تصميم للشاشات الكبيرة */}
        <div
          className="hidden lg:grid max-w-7xl mx-auto pt-29 p-6 relative z-10 gap-8 
                     grid-cols-1 lg:grid-cols-2 auto-rows-min"
        >
          <div className="col-span-1 lg:col-span-3">
            <TripHeader trip={trip} lang={lang} theme={theme} />
          </div>

          <div className="col-span-3 flex flex-row gap-8">
            <div className="col-span-3 flex flex-col gap-2.5">
              <TripCities trip={trip} lang={lang} theme={theme} themeName={themeName} />
              <TripCategories trip={trip} lang={lang} theme={theme} themeName={themeName} />
              <TripOverviewTable trip={trip} />
              <AccessibilityInfo theme={themeName} themeName={themeName} />
            </div>
            <CalendarWidget trip={trip} id={id} />
          </div>

          <div className="col-span-4 flex flex-row gap-8">
            <TripIncludes trip={trip} lang={lang} theme={theme} themeName={themeName} />
            <TripExclusions trip={trip} lang={lang} theme={theme} themeName={themeName} />
          </div>

          <div className="col-span-1 lg:col-span-3">
            <TripItinerary trip={trip} lang={lang} theme={theme} themeName={themeName} />
          </div>

          <div className="col-span-1 lg:col-span-3">
            <TripReviews trip={trip} lang={lang} theme={theme} />
          </div>
        </div>

        {/* ✅ تصميم الموبايل */}
        <div className="block lg:hidden p-4 pt-29 space-y-6">
          <TripHeader trip={trip} lang={lang} theme={theme} />
          <TripCities trip={trip} lang={lang} theme={theme} themeName={themeName} />
          <TripCategories trip={trip} lang={lang} theme={theme} themeName={themeName} />
          <TripIncludes trip={trip} lang={lang} theme={theme} themeName={themeName} />
          <TripExclusions trip={trip} lang={lang} theme={theme} themeName={themeName} />
          <TripOverviewTable trip={trip} />
          <TripItinerary trip={trip} lang={lang} theme={theme} themeName={themeName} />
          <CalendarWidget trip={trip} id={id} />
          <TripReviews trip={trip} lang={lang} theme={theme} />

          {userData &&
            userData?.role !== "ADMIN" &&
            (hasActivePurchase ? (
              <CancelButton trip={trip} theme={theme} />
            ) : (
              <button className="w-full py-4 bg-[#C2A878] text-white font-bold rounded-lg shadow-md">
                شراء الرحلة
              </button>
            ))}
        </div>

        <Footer />
        <SignUpButton />
        <LoginModal />
        {userData && <ChatWidget />}
        {chatUser && (
          <AdminChatWindow
            user={chatUser}
            admin={userData}
            messages={messages}
            onClose={() => setChatUser(null)}
          />
        )}
      </main>
    </>
  );
}
