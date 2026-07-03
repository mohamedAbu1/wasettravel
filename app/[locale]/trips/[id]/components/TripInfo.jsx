"use client";
import { FaDollarSign, FaEuroSign, FaClock } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { usePurchase } from "@/context/PurchaseContext"; 
import { motion } from "framer-motion";

const translations = {
  en: { title: "Trip Info", Adult: "Adult", Child:"Child", duration: "Duration" },
  de: { title: "Reiseinformationen", Adult: "Erwachsene", Child:"Kind", duration: "Dauer" },
  it: { title: "Informazioni sul viaggio", Adult: "Adulto", Child:"Bambino", duration: "Durata" },
  es: { title: "Información del viaje", Adult: "Adulto", Child:"Niño", duration: "Duración" },
  zh: { title: "行程信息", Adult: "成人", Child:"孩子", duration: "持续时间" },
  fr: { title: "Informations sur le voyage", Adult: "Adulte", Child:"Enfant", duration: "Durée" },
};

export default function TripInfo({ trip, lang }) {
  const { themeName } = useTheme();
  const { currency } = usePurchase();
  const t = translations[lang] || translations.en;

// ✅ تحويل الأسعار بشكل صحيح مع دعم الجنيه المصري
let displayedSolo = trip.solo_price;
if (currency === "EUR" && trip.currency === "USD") {
  displayedSolo = (trip.solo_price * 0.85).toFixed(2);
} else if (currency === "USD" && trip.currency === "EUR") {
  displayedSolo = (trip.solo_price * 1.18).toFixed(2);
} else if (currency === "EGP" && trip.currency === "USD") {
  // مثال: 1 USD ≈ 49.1 EGP (يمكنك جلبه من API)
  displayedSolo = (trip.solo_price * 49.1).toFixed(2);
} else if (currency === "USD" && trip.currency === "EGP") {
  displayedSolo = (trip.solo_price / 49.1).toFixed(2);
}

let displayedGroup = trip.group_price;
if (currency === "EUR" && trip.currency === "USD") {
  displayedGroup = (trip.group_price * 0.85).toFixed(2);
} else if (currency === "USD" && trip.currency === "EUR") {
  displayedGroup = (trip.group_price * 1.18).toFixed(2);
} else if (currency === "EGP" && trip.currency === "USD") {
  displayedGroup = (trip.group_price * 49.1).toFixed(2);
} else if (currency === "USD" && trip.currency === "EGP") {
  displayedGroup = (trip.group_price / 49.1).toFixed(2);
}

// ✅ سعر الطفل نصف سعر المجموعة
const displayedChild = (displayedGroup / 2).toFixed(2);

  // ✅ معالجة وحدة المدة
  const localizedDurationUnit = trip.duration_unit?.[lang] || trip.duration_unit?.en || "";

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`h-fit p-6 rounded-xl shadow-lg transition ${
        themeName === "dark"
          ? "bg-gradient-to-r from-gray-900 to-gray-800 text-gray-100"
          : "bg-white/90 text-[#3a2c0a]"
      }`}
    >
      <motion.h2 className="text-2xl font-bold mb-4 border-b pb-2">
        {t.title}
      </motion.h2>

      <div className="space-y-3">
        <PriceRow label={`${t.Adult} Private`} value={displayedSolo} currency={currency} themeName={themeName} />
        <PriceRow label={`${t.Adult} In Group`} value={displayedGroup} currency={currency} themeName={themeName} />
        <PriceRow label={t.Child} value={displayedChild} currency={currency} themeName={themeName} />
        <PriceRow label={`Children under 6 years old`} value={"Free"} currency={currency} themeName={themeName} />
        <span> </span>
        <motion.div className="flex items-center gap-2">
          <FaClock className={themeName === "dark" ? "text-yellow-300" : "text-[#c9a34a]"} />
          <span>{t.duration}: {trip.duration} {localizedDurationUnit}</span>
        </motion.div>
      </div>
    </motion.section>
  );
}

function PriceRow({ label, value, currency, themeName }) {
  const Icon = currency === "USD" ? FaDollarSign : FaEuroSign;
  return (
    <motion.div className="flex items-center gap-2">
      <Icon className={themeName === "dark" ? "text-yellow-300" : currency === "USD" ? "text-green-600" : "text-blue-600"} />
      <span>{label}: {value} {currency}</span>
    </motion.div>
  );
}
