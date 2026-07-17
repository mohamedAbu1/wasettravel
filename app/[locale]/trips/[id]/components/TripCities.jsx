"use client";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import { motion } from "framer-motion";

const translations = {
  en: { title: "Cities" },
  de: { title: "Städte" },
  it: { title: "Città" },
  es: { title: "Ciudades" },
  zh: { title: "城市" },
  fr: { title: "Villes" },
};

export default function TripCities({ trip, lang }) {
  const { themeName } = useTheme();
  const { cities: allCities } = useCitiesCategories();
console.log("object",trip)
  const t = translations[lang] || translations.en;

  // ✅ دالة ترجمة النصوص
  const getLocalizedText = (obj) => {
    if (!obj) return "Unknown";
    if (typeof obj === "string") return obj;
    if (typeof obj === "object") return obj?.[lang] || obj?.en || Object.values(obj)[0];
    return "Unknown";
  };

  // ✅ تأكد إن المدن Array حتى لو جاية كـ string أو object
  let cities = [];
  try {
    if (Array.isArray(trip.cities)) {
      cities = trip.cities;
    } else if (typeof trip.cities === "string") {
      const parsed = JSON.parse(trip.cities);
      cities = Array.isArray(parsed) ? parsed : [parsed];
    } else if (typeof trip.cities === "object" && trip.cities !== null) {
      cities = [trip.cities];
    }
  } catch {
    cities = [];
  }

  console.log("Trip.cities raw:", trip.cities);
  console.log("Parsed cities:", cities);
  console.log("All cities from context:", allCities);

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
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
        className={`text-2xl font-bold flex items-center gap-2 mb-4 border-b pb-2 ${
          themeName === "dark" ? "border-gold/50" : "border-[#c9a34a]/50"
        }`}
      >
        <FaMapMarkerAlt
          className={themeName === "dark" ? "text-[#c9a34a]" : "text-[#c9a34a]"}
        />
        {t.title}
      </motion.h2>

      {/* المدن */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cities.filter(Boolean).map((c, idx) => {
          console.log("City item:", c);

          // // ✅ لو العنصر مجرد ID → نبحث عنه في allCities
          const cityId = typeof c === "number" ? c : c?.id || c?.city_id || c?.cityId;
          // const cityObj = allCities.find((city) => city.id === cityId);

          // // ✅ الاسم النهائي
          // const cityName =
          //   getLocalizedText(cityObj?.name) ||
          //   getLocalizedText(c?.name) ||
          //   "Unknown";

          // console.log("Final cityName:", cityName);

          return (
            <motion.div
              key={cityId || idx}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ scale: 1.05, rotate: 1 }}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                themeName === "dark"
                  ? "bg-black/60 hover:bg-black/80"
                  : "bg-[#fdf6e3] hover:bg-[#f5deb3]"
              }`}
            >
              <FaMapMarkerAlt
                className={`flex-shrink-0 ${
                  themeName === "dark" ? "text-[#c9a34a]" : "text-[#c9a34a]"
                }`}
              />
              <span className="text-sm md:text-base font-medium">
                {c}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
