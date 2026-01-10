"use client";
import { useTrip } from "@/context/TripContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useEffect } from "react";
import { use } from "react";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/header/Header";
import EgyptianBackground from "@/components/trips/EgyptianBackground";

// الكومبوننتات الجديدة
import TripHeader from "./components/TripHeader";
import TripCities from "./components/TripCities";
import TripCategories from "./components/TripCategories";
import TripIncludes from "./components/TripIncludes";
import TripItinerary from "./components/TripItinerary";
import TripInfo from "./components/TripInfo";
import TripReviews from "./components/TripReviews";

export default function TripPage({ params }) {
  const { id } = use(params);
  const { trips, fetchTrips, getTripById, loadingTrips } = useTrip();
  const { lang } = useLanguage();
  const { themeName } = useTheme();

  useEffect(() => {
    if (!trips.length) {
      fetchTrips();
    }
  }, []);
  console.log(lang);

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
             grid-cols-1 lg:grid-cols-3 auto-rows-min"
      >
        <EgyptianBackground />

        {/* العنوان ياخد العرض بالكامل */}
        <div className="col-span-1 lg:col-span-3">
          <TripHeader trip={trip} lang={lang} />
        </div>
        <TripInfo trip={trip}  lang={lang}/>
        {/* المدن + الكاتجريز في عمود واحد */}
        <div className="flex flex-col gap-8">
          <TripCities trip={trip}  lang={lang}/>
          <TripCategories trip={trip}  lang={lang}/>
        </div>

        {/* الإنكلودز في العمود الثاني */}
        <div className="">
          <TripIncludes trip={trip} lang={lang} />
        </div>
        {/* الجاليري */}

        {/* الـ Itinerary في الصف الأخير بعرض كامل */}
        <div className="col-span-1 lg:col-span-3">
          <TripItinerary trip={trip} lang={lang} />
        </div>
        <div className="col-span-1 lg:col-span-3">
          {" "}
          <TripReviews trip={trip} lang={lang}/>{" "}
        </div>
      </div>

      <Footer />
    </main>
  );
}
