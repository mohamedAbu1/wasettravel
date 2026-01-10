"use client";
import { FaDollarSign, FaClock } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";

// كائن الترجمات
const translations = {
  en: { title: "Trip Info", price: "Price", duration: "Duration" },
  de: { title: "Reiseinformationen", price: "Preis", duration: "Dauer" },
  it: { title: "Informazioni sul viaggio", price: "Prezzo", duration: "Durata" },
  es: { title: "Información del viaje", price: "Precio", duration: "Duración" },
  zh: { title: "行程信息", price: "价格", duration: "时长" },
  fr: { title: "Informations sur le voyage", price: "Prix", duration: "Durée" },
};

export default function TripInfo({ trip, lang }) {
  const { themeName } = useTheme();

  // لو اللغة مش موجودة، نرجع للإنجليزية
  const t = translations[lang] || translations.en;

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`h-fit p-6 rounded-xl shadow-lg transition ${
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
        className={`text-2xl font-bold flex items-center gap-2 mb-4 border-b pb-2 ${
          themeName === "dark" ? "border-gold/50" : "border-[#c9a34a]/50"
        }`}
      >
        {t.title}
      </motion.h2>

      {/* المعلومات */}
      <div className="space-y-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-2"
        >
          <motion.div whileHover={{ scale: 1.2, rotate: 10 }}>
            <FaDollarSign
              className={
                themeName === "dark" ? "text-yellow-300" : "text-green-600"
              }
            />
          </motion.div>
          <span>
            {t.price}: {trip.price} {trip.currency}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center gap-2"
        >
          <motion.div whileHover={{ scale: 1.2, rotate: -10 }}>
            <FaClock
              className={
                themeName === "dark" ? "text-yellow-300" : "text-[#c9a34a]"
              }
            />
          </motion.div>
          <span>
            {t.duration}: {trip.duration} {trip.duration_unit}
          </span>
        </motion.div>
      </div>
    </motion.section>
  );
}
