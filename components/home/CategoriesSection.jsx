"use client";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import DividerWithIcon from "../layout/DividerWithIcon";
import { useRouter } from "next/navigation";

// دالة لتشفير الكويري
const encodeData = (obj) => btoa(JSON.stringify(obj));

// ✅ دالة تحسين الصور
const optimize = (url) => {
  if (!url) return "/fallback.jpg";
  return `${url}?width=800&quality=70&format=webp`;
};

function CategoryCard({ cat, themeName, language }) {
  const [imgIndex, setImgIndex] = useState(0);
  const router = useRouter();
  const cardRef = useRef(null);
  const [visible, setVisible] = useState(false);

  // Lazy Loading عبر Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % (cat.images?.length || 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [cat.images, visible]);

  const displayName =
    typeof cat.name === "object"
      ? cat.name?.[language] || cat.name?.en || cat.name
      : cat.name;

const luxuryNames = [
  "Luxusreisen",
  "Luxury Tours",
  "Tours de lujo",
  "Voyages de luxe",
  "Tour di lusso",
  "豪华旅游"
];

const handleClick = () => {
  const queryObj = {
    city: "all",
    category: [displayName],
    price: luxuryNames.includes(displayName) ? "Luxury" : "Economy",
    popular: false,
  };
  const encoded = encodeData(queryObj);
  router.push(`/trips?data=${encoded}`);
};

  return (
    <div
      ref={cardRef}
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
      <AnimatePresence mode="sync">
        {visible && (
          <motion.div
            key={imgIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <Image
              src={optimize(cat?.images?.[imgIndex])}
              alt={displayName || "Category image"}
              fill
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
              className="object-cover rounded-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>

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
  const { categories = [], loading } = useCitiesCategories();
  const [index, setIndex] = useState(0);
  const normalizedLang = i18n.language.split("-")[0];

  const looped = [...categories, ...categories];
  const cardWidth = 220;

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % categories.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [categories.length]);

  const handleDragEnd = (event, info) => {
    const offset = info.offset.x;
    const direction = offset > 0 ? -1 : 1;
    const newIndex = Math.min(
      Math.max(index + direction, 0),
      categories.length - 1
    );
    setIndex(newIndex);
  };

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

      <div className="relative overflow-hidden w-full max-w-7xl mx-auto">
        <motion.div
          className="flex h-full cursor-grab active:cursor-grabbing"
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
