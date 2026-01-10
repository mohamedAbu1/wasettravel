"use client";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";

// دالة لتحويل الوقت من 24h إلى 12h مع AM/PM
function formatTime(time) {
  if (!time) return "";
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const formattedHours = ((hours + 11) % 12) + 1; // تحويل للـ 12 ساعة
  return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${suffix}`;
}

// كائن الترجمات
const translations = {
  en: { title: "Itinerary" },
  de: { title: "Reiseplan" },
  it: { title: "Itinerario" },
  es: { title: "Itinerario" },
  zh: { title: "行程" },
  fr: { title: "Itinéraire" },
};

export default function TripItinerary({ trip, lang }) {
  const { themeName } = useTheme();

  // لو اللغة مش موجودة، نرجع للإنجليزية
  const t = translations[lang] || translations.en;

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`p-6 rounded-xl shadow-lg transition ${
        themeName === "dark"
          ? "bg-black/40 text-gold"
          : "bg-white/90 text-[#3a2c0a]"
      }`}
    >
      {/* العنوان */}
      <motion.h2
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={`text-2xl font-bold flex items-center gap-2 mb-6 border-b pb-2 ${
          themeName === "dark" ? "border-gold/50" : "border-[#c9a34a]/50"
        }`}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <FaCalendarAlt
            className={themeName === "dark" ? "text-gold" : "text-[#c9a34a]"}
          />
        </motion.div>
        {t.title}
      </motion.h2>

      {/* الأيام */}
      <div className="space-y-6">
        {trip.Trip_Days?.map((day, dayIdx) => (
          <motion.div
            key={day.id}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: dayIdx * 0.2 }}
            className={`w-fit rounded-lg p-4 shadow-md transition ${
              themeName === "dark"
                ? "bg-black/60 hover:bg-black/80"
                : "bg-[#fdf6e3] hover:bg-[#f5deb3]"
            }`}
          >
            <h3
              className={`text-lg font-semibold mb-3 ${
                themeName === "dark" ? "text-gold" : "text-[#3a2c0a]"
              }`}
            >
              Day {day.day_number}
            </h3>
            <ul className="space-y-3">
              {day.Day_Activities?.map((act, actIdx) => (
                <motion.li
                  key={act.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: actIdx * 0.1 }}
                  className="flex items-center gap-3 text-sm md:text-base"
                >
                  {/* أيقونة الساعة + الوقت */}
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 15 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex items-center gap-2 font-bold"
                  >
                    <FaClock
                      className={
                        themeName === "dark"
                          ? "text-yellow-300"
                          : "text-[#c9a34a]"
                      }
                    />
                    <span>{formatTime(act.time)}</span>
                  </motion.div>
                  {/* النشاط */}
                  <span>
                    {act.activity_translations?.[lang] ||
                      act.activity_translations?.en}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
