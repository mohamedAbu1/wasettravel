"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import DividerWithIcon from "../layout/DividerWithIcon";
import { useRouter } from "next/navigation";

const encodeData = (obj) => btoa(JSON.stringify(obj));

function CategoryCard({ cat, themeName, language }) {
  const router = useRouter();
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % (cat.images?.length || 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [cat.images]);

  const displayName =
    typeof cat.name === "object"
      ? cat.name?.[language] || cat.name?.en || cat.name
      : cat.name;

  const handleClick = () => {
    const queryObj = {
      city: "all",
      category: [displayName],
      price: "Economy",
      popular: false,
    };
    router.push(`/trips?data=${encodeData(queryObj)}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative rounded-2xl overflow-hidden group cursor-pointer h-[320px]
        transition-all duration-500 hover:scale-[1.06] hover:shadow-2xl
        ${
          themeName === "dark"
            ? "bg-[#1a1a1a] border border-gold/20 shadow-lg"
            : "bg-[#fff8e1] border border-[#c9a34a]/30 shadow-md"
        }
      `}
    >
      <Image
        src={
          cat.images?.[imgIndex]?.startsWith("/")
            ? cat.images[imgIndex]
            : cat.images?.[imgIndex]?.startsWith("http")
            ? cat.images[imgIndex]
            : "/fallback.jpg"
        }
        alt={displayName}
        fill
        className="object-cover rounded-lg"
      />

      <div
        className={`absolute inset-0 bg-gradient-to-t ${
          themeName === "dark" ? "from-black/60" : "from-[#fdf6e3]/70"
        } via-transparent to-transparent flex items-end justify-center pb-4`}
      >
        <p
          className={`text-lg font-bold tracking-wide drop-shadow-lg ${
            themeName === "dark" ? "text-white" : "text-[#3a2c0a]"
          }`}
        >
          {displayName}
        </p>
      </div>
    </div>
  );
}

const CategoriesSection = () => {
  const { themeName } = useTheme();
  const { t, i18n } = useTranslation("home");
  const { categories, loading } = useCitiesCategories();
  const normalizedLang = i18n.language.split("-")[0];

  const looped = [...categories, ...categories];
  const cardWidth = 220;

  if (loading) {
    return <p className="text-center text-gray-500">Loading categories...</p>;
  }

  return (
    <section
      className={`hidden lg:flex flex-col py-24 px-6 w-full mx-auto relative transition-colors duration-500
        ${
          themeName === "dark"
            ? "bg-[#0f0f0f] text-white"
            : "bg-[#fdf6e3] text-[#3a2c0a]"
        }
      `}
    >
      <div className="max-w-7xl mx-auto mb-10 text-start">
        <h2
          className={`text-5xl font-extrabold tracking-wide drop-shadow-md text-left
            ${
              themeName === "dark"
                ? "text-gold"
                : "bg-gradient-to-r from-[#c9a34a] to-[#eab308] bg-clip-text text-transparent"
            }
          `}
        >
          {t("ExploreCategories")}
        </h2>
        <p className="mt-4 text-lg opacity-80 text-start">{t("Discover")}</p>
        <DividerWithIcon />
      </div>

      {/* ✅ الصور المصغّرة مع Drag */}
      <div className="relative overflow-hidden w-full max-w-7xl mx-auto">
        <motion.div
          className="flex h-full cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: -looped.length * cardWidth, right: 0 }}
          dragElastic={0.1}
        >
          {looped.map((cat, i) => (
            <div
              key={i}
              className="min-w-[100%] sm:min-w-[50%] md:min-w-[33.33%] lg:min-w-[20%] p-3"
            >
              <CategoryCard
                cat={cat}
                themeName={themeName}
                language={normalizedLang}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesSection;
