"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useTripID } from "../../context/TripIDContext";

const EditTripDetailsTable = () => {
  const { themeName } = useTheme();
  const { tripData, updateTripDetails, setTripData } = useTripID();

  const [translationsMap] = useState({
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
  });

  const handleChange = (optionKey, lang, value) => {
    const detail = tripData?.trip_details?.find(d => d.option_key === optionKey);
    if (detail) {
      updateTripDetails(optionKey, detail.translations, {
        ...(detail.detail_values || {}),
        [lang]: value,
      });
    }
  };

  const handleSelectOption = (selectedKey) => {
    if (!selectedKey) return;
    const translations = translationsMap[selectedKey];
    updateTripDetails(selectedKey, translations, Object.keys(translations).reduce((acc, lang) => {
      acc[lang] = "";
      return acc;
    }, {}));
  };

  const handleRemoveDetail = (optionKey) => {
    setTripData((prev) => ({
      ...prev,
      trip_details: prev.trip_details.filter((d) => d.option_key !== optionKey),
    }));
  };
console.log("1231313232object",tripData?.trip_details)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`rounded-xl shadow-lg mt-4 p-6 ${
        themeName === "dark"
          ? "bg-black/40 border border-gold/30 text-gold"
          : "bg-white/80 border border-[#c9a34a]/30 text-[#3a2c0a]"
      }`}
    >
      <h3 className="text-2xl font-bold mb-4 text-center">✏️ Edit Trip Details</h3>

      {/* select دائمًا موجود لإضافة خيارات جديدة */}
      <div className="mb-6">
        <select
          onChange={(e) => handleSelectOption(e.target.value)}
          className={`w-full rounded-lg p-2 ${
            themeName === "dark"
              ? "bg-black/30 border border-gold/40 text-gold"
              : "bg-white border border-[#c9a34a]/40 text-[#3a2c0a]"
          }`}
        >
          <option value="">Select category to add</option>
          {Object.keys(translationsMap).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* عرض كل التفاصيل المختارة */}
      {tripData?.trip_details?.map(detail => (
        <div key={detail.id} className="mb-6 border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold">{detail.option_key}</h4>
            <button
              onClick={() => handleRemoveDetail(detail.option_key)}
              className="text-red-500 hover:text-red-700 font-bold"
            >
              ❌ Remove
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(detail.translations).map(lang => (
              <div key={lang}>
                <label className="block text-sm font-medium mb-1">
                  {detail.translations[lang]} ({lang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={detail.detail_values?.[lang] || ""}
                  onChange={(e) => handleChange(detail.option_key, lang, e.target.value)}
                  className="w-full p-2 rounded-lg border"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default EditTripDetailsTable;
