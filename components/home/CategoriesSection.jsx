/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/purity */
"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import DividerWithIcon from "../layout/DividerWithIcon";

// 👇 كومبوننت فرعي لكل كاتجري
function CategoryCard({ cat, themeName }) {
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % (cat.images?.length || 1));
    }, 4000); // كل 4 ثواني تتغير الصورة
    return () => clearInterval(interval);
  }, [cat.images]);

  return (
    <div
      className={`relative rounded-2xl overflow-hidden group cursor-pointer h-[320px]
        transition-all duration-500 hover:scale-[1.06] hover:shadow-2xl
        ${
          themeName === "dark"
            ? "bg-[#1a1a1a] border border-gold/20 shadow-lg"
            : "bg-[#fff8e1] border border-[#c9a34a]/30 shadow-md"
        }
      `}
    >
      {/* صور متتالية مع أنيمشن crossfade */}
      <AnimatePresence mode="sync">
        <motion.div
          key={imgIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Image
            src={
              cat.images?.[imgIndex]?.startsWith("/")
                ? cat.images[imgIndex]
                : cat.images?.[imgIndex]?.startsWith("http")
                  ? cat.images[imgIndex]
                  : "/fallback.jpg"
            }
            alt={cat.name}
            fill
            className="object-cover rounded-lg"
            placeholder="blur" // ✅ يظهر بلور قبل تحميل الصورة
            blurDataURL="/images/blur-placeholder.jpg" // نسخة صغيرة مضغوطة للصورة
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay */}
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
          {cat.name}
        </p>
      </div>
    </div>
  );
}

const CategoriesSection = () => {
  const { themeName } = useTheme();
  const { t } = useTranslation("home");
  const { categories, loading } = useCitiesCategories();
  const [index, setIndex] = useState(0);

  const looped = [...categories, ...categories];
  const cardWidth = 220; // 👈 عرض الكارد الواحد (عدل حسب تصميمك)

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % categories.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [categories.length]);

  // عند السحب بالماوس
  const handleDragEnd = (event, info) => {
    const offset = info.offset.x; // المسافة اللي اتحرك بيها الماوس
    const direction = offset > 0 ? -1 : 1; // يمين أو يسار
    const newIndex = Math.min(
      Math.max(index + direction, 0),
      categories.length - 1,
    );
    setIndex(newIndex); // 👈 يبدأ الأوتوماتيك من هنا
  };

  // رموز فرعونية كديكور
  const symbols = [
    "𓂀",
    "𓋹",
    "𓆣",
    "𓇼",
    "𓇯",
    "𓏏",
    "𓎛",
    "𓊽",
    "𓃾",
    "𓅓",
    "𓈇",
    "𓉐",
    "𓊹",
    "𓌙",
    "𓍿",
    "𓎟",
  ];

  if (loading) {
    return <p className="text-center text-gray-500">Loading categories...</p>;
  }

  return (
    <section
      className={` hidden lg:flex flex-col py-24 px-6 w-full mx-auto relative transition-colors duration-500
        ${
          themeName === "dark"
            ? "bg-[#0f0f0f] text-white"
            : "bg-[#fdf6e3] text-[#3a2c0a]"
        }
      `}
    >
      {/* رموز فرعونية في الخلفية */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 25 }).map((_, i) => (
          <span
            key={i}
            className={`absolute ${
              themeName === "dark" ? "text-gray-700" : "text-[#c9a34a]"
            } opacity-60 text-7xl animate-pulse`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          >
            {symbols[Math.floor(Math.random() * symbols.length)]}
          </span>
        ))}
      </div>

      {/* Title */}
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

      {/* Slider مع إمكانية السحب بالماوس + أوتوماتيك */}
      <div className="relative overflow-hidden w-full max-w-7xl mx-auto">
        <motion.div
          className="flex h-full"
          drag="x"
          dragConstraints={{ left: -looped.length * cardWidth, right: 0 }}
          whileTap={{ cursor: "grabbing" }}
          animate={{ x: -index * cardWidth }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          onDragEnd={handleDragEnd}
        >
          {looped.map((cat, i) => (
            <div
              key={i}
              className="min-w-[100%] sm:min-w-[50%] md:min-w-[33.33%] lg:min-w-[20%] p-3"
            >
              <CategoryCard cat={cat} themeName={themeName} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesSection;
