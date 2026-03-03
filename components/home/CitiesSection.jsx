"use client";
import Image from "next/image";
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import DividerWithIcon from "../layout/DividerWithIcon";
import { useRouter } from "next/navigation";

// دالة لتشفير الكويري
const encodeData = (obj) => btoa(JSON.stringify(obj));

function CityCard({ city, themeName, theme, language }) {
  const router = useRouter();
  const cityName =
    city.name?.[language] || city.name?.["en"] || city.name || "";

  const handleExplore = () => {
    const queryObj = {
      city: [cityName],   // ✅ المدينة المختارة
      category: "all",    // ✅ جميع الكاتجري
      price: "Economy",   // ✅ السعر Economy
      popular: false,     // ✅ ليس الأكثر طلباً
    };
    const encoded = encodeData(queryObj);
    router.push(`/trips?data=${encoded}`);
  };

  return (
    <div className="min-w-[250px] p-4">
      <div
        className={`
          relative h-72 rounded-2xl overflow-hidden group cursor-pointer
          ${theme.card} ${theme.border} ${theme.shadow}
          transition-all duration-500
          hover:scale-[1.05] hover:shadow-2xl hover:-rotate-1
        `}
      >
        <Image
          src={city.images?.[0] || "/fallback.jpg"}
          alt={cityName || "City image"}
          fill
          className="object-cover rounded-lg"
        />
        <div
          className={`
            absolute inset-0 
            ${theme.overlay}
            flex flex-col items-center justify-end pb-6
          `}
        >
          <p className="text-lg font-bold text-white drop-shadow-lg mb-2">
            {cityName}
          </p>
          <button
            onClick={handleExplore} // ✅ عند الضغط يتم التحويل
            className={`
              opacity-0 group-hover:opacity-100 px-4 py-2 rounded-lg text-sm font-medium transition text-white cursor-pointer
              ${
                themeName === "dark"
                  ? "bg-[#c9a34a] hover:bg-yellow-500"
                  : "bg-[#c9a34a] hover:bg-[#b5892e]"
              }
            `}
          >
            Explore
          </button>
        </div>
      </div>
    </div>
  );
}

const CitiesSection = () => {
  const { theme, themeName } = useTheme();
  const { t, i18n } = useTranslation("home");
  const { cities, loading } = useCitiesCategories();

  if (loading) {
    return <p className="text-center text-gray-500">Loading cities...</p>;
  }

  // كرر المدن مرتين علشان تعمل loop سلس
  const looped = [...cities, ...cities];

  return (
    <section
      className={`
        hidden lg:flex py-12 px-6 flex-col w-full mx-auto relative
         ${
           themeName === "dark"
             ? "bg-[#0f0f0f] text-white"
             : "bg-[#fdf6e3] text-[#3a2c0a]"
         }
      `}
    >
      <div className="max-w-2xl mx-auto mb-16 w-full">
        <h2
          className={`
            text-5xl font-extrabold tracking-wide drop-shadow-md text-center
            ${
              themeName === "dark"
                ? "text-gold"
                : "bg-gradient-to-r from-[#c9a34a] to-[#eab308] bg-clip-text text-transparent"
            }
          `}
        >
          {t("ExploreCities")}
        </h2>
        <DividerWithIcon />
      </div>

      {/* ✅ Marquee Animation */}
      <div className="relative overflow-hidden w-full max-w-7xl mx-auto h-[410px]">
        <motion.div
          className="flex h-full"
          animate={{ x: ["0%", "-100%"] }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {looped.map((city, i) => (
            <CityCard
              key={i}
              city={city}
              themeName={themeName}
              theme={theme}
              language={i18n.language}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CitiesSection;
