"use client";
import { FaTimesCircle } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";

// كائن الترجمات
const translations = {
  en: { title: "Exclusions" },
  de: { title: "Ausschlüsse" },
  it: { title: "Esclusioni" },
  es: { title: "Exclusiones" },
  zh: { title: "不包括" },
  fr: { title: "Exclusions" },
};

export default function TripExclusions({ trip, lang }) {
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

  // ✅ تأكد إن exclusions Array حتى لو جاية كـ string أو object
  let exclusions = [];
  try {
    if (Array.isArray(trip.exclusions)) {
      exclusions = trip.exclusions;
    } else if (typeof trip.exclusions === "string") {
      const parsed = JSON.parse(trip.exclusions);
      exclusions = Array.isArray(parsed) ? parsed : [parsed];
    } else if (typeof trip.exclusions === "object" && trip.exclusions !== null) {
      exclusions = [trip.exclusions];
    }
  } catch {
    exclusions = [];
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
 className="trip-detail-panel trip-exclusions-panel h-fit w-full p-5 sm:p-6">
      {/* العنوان */}
      <motion.h2
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
 className="mb-5 flex items-center justify-between border-b pb-4" >
        <span className="flex items-center gap-3"><span className="trip-detail-list-icon trip-detail-list-icon--exclude"><FaTimesCircle /></span><span className="font-display text-2xl font-bold">{t.title}</span></span><span className="rounded-full bg-[var(--surface-raised)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">{exclusions.length}</span>
      </motion.h2>

      {/* العناصر */}
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {exclusions.filter(Boolean).map((exc, idx) => {
          const excId = exc?.id || idx;
          const excText = getLocalizedText(exc?.exclusions_translations);

          return (
            <motion.li
              key={excId}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ scale: 1.05 }}
className="trip-detail-list-item trip-detail-list-item--exclude" >
              <FaTimesCircle className="shrink-0 text-rose-600" />
              <span className="text-sm font-medium leading-6 md:text-base">
                {excText}
              </span>
            </motion.li>
          );
        })}
      </ul>
    </motion.section>
  );
}
