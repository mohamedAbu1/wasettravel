"use client";
import { FaCalendarAlt } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { useState } from "react";

const translations = {
  en: { title: "Itinerary", routeDataNotice: "Some pickup or return details need confirmation. Please confirm the route with our team before booking.", missingActivity: "Activity details are being confirmed by our travel team." },
  de: { title: "Reiseplan", routeDataNotice: "Einige Abhol- oder Rückfahrtdetails müssen bestätigt werden. Bitte klären Sie die Route vor der Buchung mit unserem Team.", missingActivity: "Die Aktivitätsdetails werden von unserem Reiseteam bestätigt." },
  it: { title: "Itinerario", routeDataNotice: "Alcuni dettagli di prelievo o rientro devono essere confermati. Verifica il percorso con il nostro team prima di prenotare.", missingActivity: "I dettagli dell'attività sono in fase di conferma." },
  es: { title: "Itinerario", routeDataNotice: "Algunos detalles de recogida o regreso deben confirmarse. Confirma la ruta con nuestro equipo antes de reservar.", missingActivity: "Nuestro equipo está confirmando los detalles de la actividad." },
  zh: { title: "行程", routeDataNotice: "部分接送或返程信息需要确认。预订前请先与我们的团队确认路线。", missingActivity: "活动详情正在由旅行团队确认。" },
  fr: { title: "Itinéraire", routeDataNotice: "Certains détails de prise en charge ou de retour doivent être confirmés. Vérifiez l’itinéraire avec notre équipe avant de réserver.", missingActivity: "Les détails de l'activité sont en cours de confirmation." },
};

export default function TripItinerary({ trip, lang }) {
  const { theme, themeName } = useTheme();
  const t = translations[lang] || translations.en;

  // ✅ دالة ترجمة النصوص من JSON أو object
  const getLocalizedText = (obj) => {
    if (!obj) return "";
    if (typeof obj === "string") {
      try {
        const parsed = JSON.parse(obj);
        return parsed?.[lang] || parsed?.en || Object.values(parsed)[0];
      } catch {
        return obj;
      }
    }
    if (typeof obj === "object") {
      return obj?.[lang] || obj?.en || Object.values(obj).find((value) => typeof value === "string" && value.trim()) || "";
    }
    return "Unknown";
  };

  // ✅ تقسيم الأيام إلى مجموعات كل مجموعة فيها يومين
  const chunkDays = (days, size = 2) => {
    const result = [];
    for (let i = 0; i < days.length; i += size) {
      result.push(days.slice(i, i + size));
    }
    return result;
  };

  // The detail API exposes the collection as `itinerary`; keep `days` as a
  // backwards-compatible fallback for older responses.
  let tripDays = [];
  try {
    const rawDays = trip?.itinerary ?? trip?.days;
    if (Array.isArray(rawDays)) {
      tripDays = rawDays;
    } else if (typeof rawDays === "string") {
      const parsed = JSON.parse(rawDays);
      tripDays = Array.isArray(parsed) ? parsed : [parsed];
    }
  } catch {
    tripDays = [];
  }

  const dayGroups = chunkDays(
    (tripDays || [])
      .slice()
      .sort((a, b) => Number(a.day_number || 0) - Number(b.day_number || 0))
      .map((day) => ({
        ...day,
        activities: (day.activities || []).slice().sort((a, b) => {
          const timeA = String(a.time || "99:99");
          const timeB = String(b.time || "99:99");
          return timeA.localeCompare(timeB);
        }),
      })),
  );
  const itineraryText = dayGroups.flat().flatMap((day) => day.activities || []).map((activity) => getLocalizedText(activity.activity_translations)).join(" ");
  const tripContext = [
    getLocalizedText(trip?.title),
    ...(trip?.cities || []).map((city) => getLocalizedText(city?.name)),
    getLocalizedText(trip?.start_point),
  ].join(" ");
  const hasRouteConflict = /luxor/i.test(tripContext) && /hurgada|hurghada/i.test(itineraryText);
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`trip-detail-panel h-fit rounded-xl p-4 shadow-lg transition sm:p-6 ${
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
        className={`text-2xl font-bold flex items-center gap-2 mb-4 border-b p-2 ${theme.border}`}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <FaCalendarAlt className={theme.icon} />
        </motion.div>
        {t.title}
      </motion.h2>

      {hasRouteConflict ? <div role="alert" className="mb-5 rounded-xl border border-amber-400/35 bg-amber-400/10 px-4 py-3 text-sm font-semibold text-amber-800 dark:text-amber-200">{t.routeDataNotice}</div> : null}

      {/* عرض المجموعة الحالية فقط */}
      <motion.div
        key={currentPage}
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {dayGroups[currentPage]?.map((day, dayIdx) => (
          <motion.div
            key={day.id || dayIdx}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: dayIdx * 0.2 }}
            className={`flex flex-col items-center gap-3 p-3 rounded-lg cursor-pointer ${
              themeName === "dark"
                ? "bg-gray-800 hover:bg-black/40 text-gray-100"
                : "bg-white hover:bg-[#f5deb3]/40 text-[#3a2c0a]"
            }`}
          >
            <h3 className={`text-lg font-semibold mb-3 ${theme.title}`}>
              Day {day.day_number}
            </h3>
            <ul className="space-y-3">
              {day.activities?.map((act, actIdx) => {
                const activityText = getLocalizedText(act.activity_translations);
                if (!activityText) return null;
                return (
                <motion.li
                  key={act.id || actIdx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: actIdx * 0.1 }}
                  className={`flex items-start gap-3 text-sm md:text-base ${theme.subText}`}
                >
                  <span className="pt-0.5 text-[#c9a34a]" aria-hidden="true">•</span>
                  <span>{getLocalizedText(act.activity_translations)}</span>
                </motion.li>
                );
              })}
              {!(day.activities || []).some((activity) => getLocalizedText(activity.activity_translations)) ? <li className={`text-sm ${theme.subText}`}>{t.missingActivity}</li> : null}
            </ul>
          </motion.div>
        ))}
      </motion.div>

      {dayGroups.length === 0 ? (
        <p className={`mt-4 text-sm ${theme.subText}`}>No itinerary has been added yet.</p>
      ) : null}

      {/* ✅ Pagination */}
      {dayGroups.length > 1 ? <div className="flex justify-center mt-6 gap-2">
        {dayGroups.map((_, idx) => (
          <button
            type="button"
            key={idx}
            onClick={() => setCurrentPage(idx)}
            style={{ cursor: "pointer" }}
            className={`px-3 py-1 rounded-full font-bold transition ${
              currentPage === idx
                ? `${theme.buttonPrimary}`
                : `${theme.buttonSecondary}`
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div> : null}
    </motion.section>
  );
}
