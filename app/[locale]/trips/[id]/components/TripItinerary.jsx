"use client";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// ✅ تنسيق الوقت
function formatTime(time) {
  if (!time) return "";
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const formattedHours = ((hours + 11) % 12) + 1;
  return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${suffix}`;
}

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
  const t = translations[lang] || translations.en;

  // ✅ تقسيم الأيام إلى مجموعات (كل مجموعة فيها يومين)
  const chunkDays = (days, size = 2) => {
    const result = [];
    for (let i = 0; i < days.length; i += size) {
      result.push(days.slice(i, i + size));
    }
    return result;
  };

  // ✅ تأكد إن الأيام جاية بشكل صحيح (Array أو JSON string)
  const tripDays = Array.isArray(trip.days)
    ? trip.days
    : Array.isArray(trip.trip_days)
    ? trip.trip_days
    : typeof trip.days === "string"
    ? JSON.parse(trip.days)
    : [];

  const dayGroups = chunkDays(tripDays);
  const [currentPage, setCurrentPage] = useState(0);

  // ✅ جلب الأنشطة من API إذا كانت null
  const [activitiesMap, setActivitiesMap] = useState({});

  useEffect(() => {
    async function fetchActivities(dayId) {
      try {
        const res = await fetch(`/api/day_activities?day_id=${dayId}`);
        const data = await res.json();
        setActivitiesMap((prev) => ({ ...prev, [dayId]: data }));
      } catch (err) {
        console.error("Error fetching activities:", err);
      }
    }

    tripDays.forEach((day) => {
      if (!day.activities && day.id) {
        fetchActivities(day.id);
      }
    });
  }, [tripDays]);
console.log("object",activitiesMap)
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`p-6 rounded-xl shadow-lg transition ${
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

      {/* عرض المجموعة الحالية فقط */}
      <motion.div
        key={currentPage}
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {dayGroups[currentPage]?.map((day, dayIdx) => {
          const activities =
            day.activities ||
            day.day_activities ||
            activitiesMap[day.id] ||
            [];

          return (
            <motion.div
              key={day.id || day.day_number || dayIdx}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: dayIdx * 0.2 }}
              className={`rounded-lg p-4 shadow-md transition ${
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
                Day {day.day_number || dayIdx + 1}
              </h3>
              <ul className="space-y-3">
                {activities.length > 0 ? (
                  activities.map((act, actIdx) => (
                    <motion.li
                      key={act.id || actIdx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: actIdx * 0.1 }}
                      className="flex items-center gap-3 text-sm md:text-base"
                    >
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
                      <span>
                        {act.activity_translations?.[lang] ||
                          act.activity_translations?.en ||
                          act.activity ||
                          "No activity description"}
                      </span>
                    </motion.li>
                  ))
                ) : (
                  <li className="text-gray-500 italic">
                    No activities available for this day
                  </li>
                )}
              </ul>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ✅ Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        {dayGroups.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx)}
            style={{ cursor: "pointer" }}
            className={`px-3 py-1 rounded-full font-bold transition ${
              currentPage === idx
                ? themeName === "dark"
                  ? "bg-[#c9a34a] text-black"
                  : "bg-[#c9a34a] text-white"
                : themeName === "dark"
                ? "bg-gray-700 text-gold hover:bg-gray-600"
                : "bg-gray-200 text-[#3a2c0a] hover:bg-gray-300"
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </motion.section>
  );
}
