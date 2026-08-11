"use client";
import { FaTags } from "react-icons/fa";
import { motion } from "framer-motion";

// الترجمات للعناوين
const translations = {
  en: { title: "Categories" },
  de: { title: "Kategorien" },
  it: { title: "Categorie" },
  es: { title: "Categorías" },
  zh: { title: "类别" },
  fr: { title: "Catégories" },
};

export default function TripCategories({ trip, lang, themeName }) {
  const t = translations[lang] || translations.en;

  // دالة ترجمة النصوص من JSON أو object
  const getLocalizedText = (obj) => {
    if (!obj) return "Unknown";
    if (typeof obj === "string") {
      try {
        const parsed = JSON.parse(obj);
        return parsed?.[lang] || parsed?.en || Object.values(parsed)[0];
      } catch {
        return obj;
      }
    }
    if (typeof obj === "object") {
      return obj?.[lang] || obj?.en || Object.values(obj)[0];
    }
    return "Unknown";
  };

  // تأكد إن التصنيفات Array حتى لو جاية كـ string أو object
  let categories = [];
  try {
    if (Array.isArray(trip.categories)) {
      categories = trip.categories;
    } else if (typeof trip.categories === "string") {
      const parsed = JSON.parse(trip.categories);
      categories = Array.isArray(parsed) ? parsed : [parsed];
    } else if (typeof trip.categories === "object" && trip.categories !== null) {
      categories = [trip.categories];
    }
  } catch {
    categories = [];
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
       className={`h-fit p-6 rounded-xl shadow-lg transition ${
        themeName === "dark"
          ? "bg-gradient-to-r from-gray-900 to-gray-800 text-gray-100"
          : "bg-white/90 text-[#3a2c0a]"
      }`}
    >
      {/* العنوان */}
      <motion.h2
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={`text-2xl font-bold flex items-center gap-2 mb-4 border-b p-2 ${
          themeName === "dark" ? "border-gold/50" : "border-[#c9a34a]/50"
        }`}
      >
        <FaTags
          className={themeName === "dark" ? "text-[#FFD700]" : "text-[#c9a34a]"}
        />
        {t.title}
      </motion.h2>

      {/* التصنيفات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.filter(Boolean).map((cat, idx) => {
          const categoryName = getLocalizedText(cat?.name);

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ scale: 1.05, rotate: 1 }}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                themeName === "dark"
                  ? "bg-gray-800 hover:bg-black/40 text-gray-100"
                  : "bg-white hover:bg-[#f5deb3]/40 text-[#3a2c0a]"
              }`}
            >
              <FaTags
                className={themeName === "dark" ? "text-[#FFD700]" : "text-[#c9a34a]"}
              />
              <span className="text-sm md:text-base font-medium">
                {categoryName}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
