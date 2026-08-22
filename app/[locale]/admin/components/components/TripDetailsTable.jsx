"use client";
import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useTrip } from "../../context/TripContext"; // ✅ ربط مع TripContext

// ثابت الترجمات لكل خيار
const translationsMap = {
  Destinations: { en: "Destinations", es: "Destinos", fr: "Destinations", de: "Reiseziele", it: "Destinazioni", zh: "目的地" },
  Duration: { en: "Duration", es: "Duración", fr: "Durée", de: "Dauer", it: "Durata", zh: "持续时间" },
  Distance: { en: "Distance", es: "Distancia", fr: "Distance", de: "Entfernung", it: "Distanza", zh: "距离" },
  Guide: { en: "Guide", es: "Guía", fr: "Guide", de: "Reiseführer", it: "Guida", zh: "导游" },
  Transport: { en: "Transport", es: "Transporte", fr: "Transport", de: "Transport", it: "Trasporto", zh: "交通" },
  "Group Type": { en: "Group Type", es: "Tipo de grupo", fr: "Type de groupe", de: "Gruppentyp", it: "Tipo di gruppo", zh: "团体类型" },
  Meals: { en: "Meals", es: "Comidas", fr: "Repas", de: "Mahlzeiten", it: "Pasti", zh: "餐饮" },
  "Start Point": { en: "Start Point", es: "Punto de inicio", fr: "Point de départ", de: "Startpunkt", it: "Punto di partenza", zh: "起点" },
  Route: { en: "Route", es: "Ruta", fr: "Itinéraire", de: "Route", it: "Percorso", zh: "路线" },
  "Ship Category": { en: "Ship Category", es: "Categoría de barco", fr: "Catégorie de navire", de: "Schiffskategorie", it: "Categoria nave", zh: "船舶类别" },
  "Board Basis": { en: "Board Basis", es: "Régimen de alojamiento", fr: "Formule", de: "Verpflegung", it: "Trattamento", zh: "膳食安排" },
  "Sites Visited": { en: "Sites Visited", es: "Sitios visitados", fr: "Sites visités", de: "Besuchte Orte", it: "Siti visitati", zh: "参观地点" },
  "Start/End Point": { en: "Start/End Point", es: "Punto de inicio/fin", fr: "Point de départ/arrivée", de: "Start-/Endpunkt", it: "Punto di inizio/fine", zh: "起点/终点" },
};

const TripDetailsTable = () => {
  const { themeName } = useTheme();
  const { tripData, addDetail, updateDetail, removeDetail } = useTrip(); // ✅ استخدام TripContext

  const options = Object.keys(translationsMap);

  // إضافة صف جديد عند اختيار الأدمن
  const handleSelectOption = (selectedKey) => {
    if (!selectedKey) return;
    addDetail(selectedKey, translationsMap[selectedKey]);
  };

  // تعديل القيم
  const handleChange = (optionKey, lang, value) => {
    updateDetail(optionKey, lang, value);
  };

  // حذف صف
  const handleRemoveRow = (optionKey) => {
    removeDetail(optionKey);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`rounded-xl shadow-lg p-6 ${
        themeName === "dark"
          ? "bg-black/40 border border-gold/30 text-gold"
          : "bg-white/80 border border-[#c9a34a]/30 text-[#3a2c0a]"
      }`}
    >
      <h3 className="text-2xl font-bold mb-4 text-center">Trip Details</h3>

      {/* اختيار الفئة */}
      <div className="mb-6">
        <select
          onChange={(e) => handleSelectOption(e.target.value)}
          className={`w-full rounded-lg p-2 ${
            themeName === "dark"
              ? "bg-black/30 border border-gold/40 text-gold"
              : "bg-white border border-[#c9a34a]/40 text-[#3a2c0a]"
          }`}
        >
          <option value="">Select category</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* عرض الصفوف */}
      {tripData.details.map((detail) => (
        <div key={detail.id} className="mb-6 border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold">{detail.option_key}</h4>
            <button
              onClick={() => handleRemoveRow(detail.option_key)}
              className="text-red-500 hover:text-red-700 font-bold"
            >
              ✖
            </button>
          </div>

          {/* حقول اللغات */}
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(detail.translations).map((lang) => (
              <div key={lang}>
                <label className="block text-sm font-medium mb-1">
                  {detail.translations[lang]} ({lang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={detail.detail_values[lang] || ""}
                  onChange={(e) => handleChange(detail.option_key, lang, e.target.value)}
                  placeholder={`Enter ${detail.translations[lang]} value`}
                  className={`w-full p-2 rounded-lg border ${
                    themeName === "dark"
                      ? "bg-black/30 border-gold/40 text-gold"
                      : "bg-white border-[#c9a34a]/40 text-[#3a2c0a]"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default TripDetailsTable;
