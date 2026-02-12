/* eslint-disable react-hooks/static-components */
"use client";
import React from "react";
import { FaMapMarkerAlt, FaDollarSign, FaTags, FaFire } from "react-icons/fa";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import Divider from "@/components/layout/Divider"; // ✅ استدعاء الكومبوننت الجديد


export default function TripsFilter({ filters, setFilters }) {
  const { cities: allCities, categories: allCategories, loading } = useCitiesCategories();
  const { i18n } = useTranslation();
  const currentLang = i18n.language || "en";
  const { t } = useTranslation("trips");
  const { themeName } = useTheme();

  const handleCheckboxChange = (type, value) => {
    const current = filters[type] || [];
    if (current.includes(value)) {
      setFilters({ ...filters, [type]: current.filter((v) => v !== value) });
    } else {
      setFilters({ ...filters, [type]: [...current, value] });
    }
  };

  const priceRanges = [
    { label: "0 - 450 $", value: "0-450" },
    { label: "451 - 900 $", value: "451-900" },
    { label: "901 - 1500 $", value: "901-1500" },
    { label: "1500+ $", value: "1500+" },
  ];


  if (loading) {
    return <p className="text-center text-gray-500">{t("Loading")}</p>;
  }

  // ✨ Variants للأنيميشن
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } }
  };

  return (
    <motion.aside
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer}
      className={`p-6 rounded-xl shadow-lg transition ${
        themeName === "dark"
          ? "bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#1a1a1a] text-[#b5892e] border border-[#c9a34a]/40 "
          : "bg-white/0 border border-[#c9a34a]/30  text-[#1a1a1a]"
      }`}
    >
      <motion.h3
        variants={fadeUp}
        className={`text-xl font-bold mb-6 ${
          filters.themeName === "dark" ? "text-[#c9a34a]" : "text-[#c9a34a]"
        }`}
      >
        {t("Filters")}
      </motion.h3>

      <motion.div variants={staggerContainer} className="flex flex-col gap-8">
        {/* المدن */}
        <motion.div variants={fadeUp}>
          <label className="flex items-center gap-2 font-semibold mb-3 text-[#c9a34a]">
            <FaMapMarkerAlt /> {t("Cities")} :
          </label>
          <div className="grid grid-cols-2 gap-2 ml-6">
            {allCities.map((city) => {
              const cityName =
                city.name?.[currentLang] || city.name?.["en"] || city.name;
              return (
                <motion.label
                  variants={fadeUp}
                  key={city.id ?? cityName}
                  className="flex items-center gap-2 cursor-pointer hover:text-[#c9a34a] transition"
                >
                  <input
                    type="checkbox"
                    className="accent-[#c9a34a] cursor-pointer"
                    checked={filters.city?.includes(cityName) || false}
                    onChange={() => handleCheckboxChange("city", cityName)}
                  />
                  {cityName}
                </motion.label>
              );
            })}
          </div>
        </motion.div>

        <Divider fadeUp={fadeUp} themeName={themeName} />
        {/* الكاتجري */}
        <motion.div variants={fadeUp}>
          <label className="flex items-center gap-2 font-semibold mb-3 text-[#c9a34a]">
            <FaTags /> {t("Categories")} :
          </label>
          <div className="grid grid-cols-2 gap-2 ml-6">
            {allCategories.map((cat) => {
              const categoryName =
                cat.name?.[currentLang] || cat.name?.["en"] || cat.name;
              return (
                <motion.label
                  variants={fadeUp}
                  key={cat.id ?? categoryName}
                  className="flex items-center gap-2 cursor-pointer hover:text-[#c9a34a] transition"
                >
                  <input
                    type="checkbox"
                    className="accent-[#c9a34a] cursor-pointer"
                    checked={filters.category?.includes(categoryName) || false}
                    onChange={() => handleCheckboxChange("category", categoryName)}
                  />
                  {categoryName}
                </motion.label>
              );
            })}
          </div>
        </motion.div>

        <Divider fadeUp={fadeUp} themeName={themeName} />
        {/* السعر */}
        <motion.div variants={fadeUp}>
          <label className="flex items-center gap-2 font-semibold mb-3 text-[#c9a34a]">
            <FaDollarSign />{t("PriceRange")} :
          </label>
          <div className="flex flex-col gap-2 ml-6">
            {priceRanges.map((range) => (
              <motion.label
                variants={fadeUp}
                key={range.value}
                className="flex items-center gap-2 cursor-pointer hover:text-[#c9a34a] transition"
              >
                <input
                  type="radio"
                  name="priceRange"
                  className="accent-[#c9a34a] cursor-pointer"
                  checked={filters.price === range.value}
                  onChange={() => setFilters({ ...filters, price: range.value })}
                />
                {range.label}
              </motion.label>
            ))}
          </div>
        </motion.div>

        <Divider fadeUp={fadeUp} themeName={themeName} />
        {/* الأكثر طلباً */}
        <motion.div variants={fadeUp}>
          <label className="flex items-center gap-2 font-semibold cursor-pointer text-[#c9a34a] hover:text-[#c9a34a] transition">
            <FaFire />{t("MostPopular")} 
            <input
              type="checkbox"
              className="ml-2 accent-[#c9a34a] cursor-pointer"
              checked={filters.popular || false}
              onChange={(e) =>
                setFilters({ ...filters, popular: e.target.checked })
              }
            />
          </label>
        </motion.div>
      </motion.div>
    </motion.aside>
  );
}
