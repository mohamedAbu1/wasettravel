"use client";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import DividerWithIcon from "../layout/DividerWithIcon";
import { useRouter } from "next/navigation";

const encodeData = (obj) => btoa(JSON.stringify(obj));

const optimize = (url) => {
  if (!url || typeof url !== "string" || url.trim() === "") {
    return "/fallback.jpg";
  }
  if (url.startsWith("http")) {
    return `${url}?width=800&quality=70&format=webp`;
  }
  const cleanUrl = url.startsWith("/") ? url : `/${url}`;
  return `${cleanUrl}?width=800&quality=70&format=webp`;
};

function CategoryCard({ cat, themeName, language }) {
  const [imgIndex, setImgIndex] = useState(0);
  const router = useRouter();
  const cardRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setVisible(true);
      },
      { threshold: 0.2 },
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !cat.images?.length) return;
    const interval = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % cat.images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [visible, cat.images]);

  const displayName =
    typeof cat.name === "object"
      ? cat.name?.[language] || cat.name?.en || Object.values(cat.name)[0]
      : cat.name;

  const handleClick = () => {
    const queryObj = {
      city: "all",
      category: [displayName],
      price: ["Luxury Tours", "Luxusreisen", "Voyages de luxe"].includes(displayName)
        ? "Luxury"
        : "All",
      popular: false,
    };
    const encoded = encodeData(queryObj);
    router.push(`/trips?data=${encoded}`);
  };

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      className={`relative rounded-2xl overflow-hidden group cursor-pointer h-[280px] sm:h-[320px]
        transition-all duration-500 hover:scale-[1.06] hover:shadow-2xl
        ${
          themeName === "dark"
            ? "bg-[#1a1a1a] border border-gold/20 shadow-lg"
            : "bg-[#fff8e1] border border-[#c9a34a]/30 shadow-md"
        }`}
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
              src={optimize(cat.images[imgIndex])}
              alt={displayName}
              fill
              loading="lazy"
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
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`text-lg font-bold tracking-wide drop-shadow-lg ${
            themeName === "dark" ? "text-white" : "text-[#3a2c0a]"
          }`}
        >
          {displayName}
        </motion.p>
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
  const containerRef = useRef(null);

  const cardWidth = 220;
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ سلايدر تلقائي دائري
  useEffect(() => {
    if (!categories.length) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % categories.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [categories.length]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading categories...</p>;
  }

  const looped = [...categories, ...categories, ...categories];

  // حساب الإزاحة بحيث الكارد الحالي يكون في منتصف الشاشة
  const offset = (containerWidth / 2) - (cardWidth / 2) - (index % categories.length) * cardWidth;

  return (
    <section
      className={`flex flex-col py-16 px-4 sm:px-6 w-full mx-auto relative transition-colors duration-500
        ${themeName === "dark" ? "bg-[#0f0f0f] text-white" : "bg-[#fdf6e3] text-[#3a2c0a]"}
      `}
    >
      <div className="max-w-7xl mx-auto mb-10 text-start">
        <h2
          className={`text-3xl sm:text-5xl font-extrabold tracking-wide drop-shadow-md text-left
            ${themeName === "dark"
              ? "text-gold"
              : "bg-gradient-to-r from-[#c9a34a] to-[#eab308] bg-clip-text text-transparent"}
          `}
        >
          {t("ExploreCategories")}
        </h2>
        <p className="mt-4 text-base sm:text-lg opacity-80 text-start">{t("Discover")}</p>
        <DividerWithIcon />
      </div>

      <div ref={containerRef} className="relative overflow-hidden w-full max-w-7xl mx-auto">
        <motion.div
          className="flex h-full cursor-grab active:cursor-grabbing"
          animate={{ x: offset }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {looped.map((cat, i) => (
            <div
              key={i}
              className="min-w-[220px] p-3"
              style={{ width: cardWidth }}
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
