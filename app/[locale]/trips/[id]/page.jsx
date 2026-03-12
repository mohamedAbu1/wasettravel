"use client";
import { useTrip } from "@/context/TripContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useEffect } from "react";
import { use } from "react";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/header/Header";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import LoginModal from "@/components/home/components/LoginModal";
import SignUpButton from "@/components/home/components/SignUpButton";
// الكومبوننتات الجديدة
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
import TripVideo from "./components/TripVideo";

export default function TripPage({ params }) {
  const { id } = use(params);
  const { trips, fetchTrips, getTripById, loadingTrips } = useTrip();
  const { lang } = useLanguage();
  const { themeName } = useTheme();
  const { user } = useAuth(); // ✅ جلب المستخدم الحالي

  useEffect(() => {
    if (!trips.length) {
      fetchTrips();
    }
  }, []);

  const trip = getTripById(id);
  if (!trip) {
    return <p>Trip not found</p>;
  }

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

      <div
        style={{ paddingTop: "110px" }}
        className="max-w-7xl mx-auto p-6 relative z-10 grid gap-8 
             grid-cols-1 lg:grid-cols-2 auto-rows-min"
      >
        <EgyptianBackground />

        {/* العنوان ياخد العرض بالكامل */}
        <div className="col-span-1 lg:col-span-3">
          <TripHeader trip={trip} lang={lang} />
        </div>
        {/* المدن + الكاتجريز في عمود واحد */}
        <div className="col-span-3 flex flex-row gap-8">
          <div className="col-span-3 ">
            <TripInfo trip={trip} lang={lang} />
            <TripCities trip={trip} lang={lang} />
            <TripCategories trip={trip} lang={lang} />
          </div>
          <TripVideo trip={trip} lang={lang} />{" "}
        </div>

        {/* الإنكلودز في العمود الثاني */}
        <div className="col-span-3 flex flex-row gap-8">
          <TripIncludes trip={trip} lang={lang} />
          {/* ✅ الفيديو بجانب الإنكلود */}
        </div>
        {/* الجاليري */}

        {/* الـ Itinerary في الصف الأخير بعرض كامل */}
        <div className="col-span-1 lg:col-span-3">
          <TripItinerary trip={trip} lang={lang} />
        </div>
        <div className="col-span-1 lg:col-span-3">
          {" "}
          <TripReviews trip={trip} lang={lang} />
          {user && <PurchaseButton trip={trip} />} {/* زر الشراء */}
        </div>
      </div>

      <Footer />
      <SignUpButton />
      <LoginModal />
      {user && <ChatWidget />}
    </main>
  );
}
