"use client";
import { FaCheckCircle } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";

// كائن الترجمات
const translations = {
  en: { title: "Includes" },
  de: { title: "Enthält" },
  it: { title: "Include" },
  es: { title: "Incluye" },
  zh: { title: "包含" },
  fr: { title: "Inclus" },
};

export default function TripIncludes({ trip, lang }) {
 const { theme } = useTheme();

  // لو اللغة مش موجودة، نرجع للإنجليزية
  const t = translations[lang] || translations.en;

  // ✅ دالة ترجمة النصوص من JSON أو object
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

  // ✅ تأكد إن includes Array حتى لو جاية كـ string أو object
  let includes = [];
  try {
    if (Array.isArray(trip.includes)) {
      includes = trip.includes;
    } else if (typeof trip.includes === "string") {
      const parsed = JSON.parse(trip.includes);
      includes = Array.isArray(parsed) ? parsed : [parsed];
    } else if (typeof trip.includes === "object" && trip.includes !== null) {
      includes = [trip.includes];
    }
  } catch {
    includes = [];
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
 className="trip-detail-panel trip-includes-panel h-fit w-full p-5 sm:p-6">
      {/* العنوان */}
      <motion.h2
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
 className="mb-5 flex items-center justify-between border-b pb-4" >
        <span className="flex items-center gap-3"><span className="trip-detail-list-icon trip-detail-list-icon--include"><FaCheckCircle /></span><span className="font-display text-2xl font-bold">{t.title}</span></span><span className="rounded-full bg-[var(--surface-raised)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">{includes.length}</span>
      </motion.h2>

      {/* العناصر */}
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {includes.filter(Boolean).map((inc, idx) => {
          const incId = inc?.id || idx;
          const incText = getLocalizedText(inc?.include_translations);

          return (
            <motion.li
              key={incId}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ scale: 1.05 }}
className="trip-detail-list-item trip-detail-list-item--include" >
              <FaCheckCircle className="shrink-0 text-emerald-600" />
              <span className="text-sm font-medium leading-6 md:text-base">
                {incText}
              </span>
            </motion.li>
          );
        })}
      </ul>
    </motion.section>
  );
}
