/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/purity */
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useTrip } from "@/context/TripContext";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import { useEffect } from "react";
import { FaStar } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function TripsGrid({ cardStyle = "vertical" }) {
  const { themeName } = useTheme();
  const { trips, fetchTrips, loadingTrips } = useTrip();
  const { lang } = useLanguage(); // اللغة الحالية
  const { cities: allCities, categories: allCategories } =
    useCitiesCategories();
  const router = useRouter();

  useEffect(() => {
    fetchTrips();
  }, []);

  const getRandomStars = () => Math.floor(Math.random() * 3) + 3;
  const { t } = useTranslation("trips");

  if (loadingTrips) {
    return <p className="text-center text-gray-500">Loading trips...</p>;
  }

  return (
    <div
      className={`flex-1 ${
        cardStyle === "vertical"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "grid grid-cols-1 md:grid-cols-2 gap-6"
      }`}
    >
      {trips.map((trip, i) => {
        const stars = getRandomStars();
        const reviews = trip.reviews || Math.floor(Math.random() * 200) + 20;

        // استخراج أسماء المدن والكاتجري مترجمة حسب اللغة الحالية
        const getLocalizedText = (obj, lang) => {
          if (!obj) return "Unknown";
          if (typeof obj === "string") return obj;
          return obj[lang] || obj["en"] || "Unknown";
        };

        const tripCities =
          trip.trip_cities?.length > 0
            ? trip.trip_cities
                .map((c) => {
                  // جرب كل الاحتمالات
                  return (
                    getLocalizedText(c.cities?.name, lang) ||
                    getLocalizedText(c.city?.name, lang) ||
                    getLocalizedText(c.city_name, lang)
                  );
                })
                .join(" • ")
            : "Unknown";

        const tripCategories =
          trip.trip_categories?.length > 0
            ? trip.trip_categories
                .map((cat) => {
                  const catObj = allCategories.find(
                    (category) => category.id === cat.category_id
                  );
                  return (
                    catObj?.name?.[lang] ||
                    catObj?.name?.["en"] ||
                    catObj?.name ||
                    "General"
                  );
                })
                .join(" • ")
            : "General";

        return (
          <div
            key={trip.id || i}
            className={`relative rounded-xl shadow-lg overflow-hidden transform transition 
              ${
                themeName === "dark"
                  ? "border border-gold/30"
                  : "border border-[#c9a34a]/30"
              } 
              ${
                cardStyle === "horizontal"
                  ? "h-86 flex animate-slideIn"
                  : "h-88 animate-fadeScale"
              }`}
          >
            {/* صورة الرحلة */}
            <Image
              src={trip.cover_image || "/default.jpg"}
              alt={trip.title?.[lang] || trip.title?.en || "Trip image"}
              width={660}
              height={800}
              className="object-cover w-full h-full"
            />

            {/* Overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-t ${
                themeName === "dark"
                  ? "from-black/80 via-black/40 to-transparent"
                  : "from-[#3a2c0a]/70 via-[#3a2c0a]/40 to-transparent"
              }`}
            />

            {/* محتوى الكارد */}
            <div
              className={`absolute bottom-0 p-4 w-full flex flex-col gap-2 text-white ${
                cardStyle === "horizontal" ? "justify-center" : ""
              }`}
            >
              <h4
                className={`text-lg font-bold ${
                  themeName === "dark" ? "text-gold" : "text-white"
                }`}
              >
                {trip.title?.[lang] || trip.title?.en || "Untitled"}
              </h4>

              {/* المدن والكاتجري مترجمة */}
              <p className="text-sm opacity-90">
                {tripCities} • {tripCategories}
              </p>

              <p className="text-md font-semibold">
                <span
                  className={`px-2 py-1 rounded ${
                    themeName === "dark"
                      ? "bg-[#c9a34a] text-black"
                      : "bg-[#c9a34a] text-white"
                  }`}
                >
                  ${trip.price}
                </span>
              </p>

              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, idx) => (
                  <FaStar
                    key={idx}
                    className={`${
                      idx < stars
                        ? "text-yellow-400"
                        : "text-gray-500 opacity-50"
                    }`}
                  />
                ))}
                <span className="text-sm opacity-80">
                  ({reviews} {t("reviews")})
                </span>
              </div>

              <button
                style={{ cursor: "pointer" }}
                onClick={() => router.push(`/trips/${trip.id}`)}
                className={`mt-2 px-4 py-2 rounded-lg font-bold transition ${
                  themeName === "dark"
                    ? "bg-[#c9a34a] text-black hover:bg-yellow-500"
                    : "bg-[#c9a34a] text-white hover:bg-[#b5892e]"
                }`}
              >
                {t("btn")}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
