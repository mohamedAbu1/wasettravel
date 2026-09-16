"use client";
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";

export default function TripOverviewTable({ trip }) {
  const { theme, themeName } = useTheme();
  const { lang } = useLanguage(); // اللغة الحالية (مثلاً "en" أو "fr" أو "ar")

  // تأكد إن البيانات موجودة
  const overviewData = trip?.trip_details || [];
  const languages = { en: "Tour Overview", es: "Resumen del tour", fr: "Aperçu du tour", de: "Tourübersicht", it: "Panoramica del tour", zh: "行程概览" };

  const parseObject = (value) => {
    if (!value) return {};
    if (typeof value === "object") return value;
    try { return JSON.parse(value); } catch { return {}; }
  };

  return (
    <section
      className={`trip-detail-panel h-fit p-6 rounded-xl shadow-lg transition ${
        themeName === "dark"
          ? "bg-gradient-to-r from-gray-900 to-gray-800 text-gray-100"
          : "bg-white/90 text-[#3a2c0a]"
      }`}
    >
      <h2
        className={`text-2xl font-bold flex items-center gap-2 mb-4 border-b p-2 ${theme.border}`}
      >
        {languages[lang] || languages.en}
      </h2>

      <div className={`overflow-x-auto border ${theme.border}`}>
        <table className="w-full border-collapse">
          <tbody>
            {overviewData.map((item, index) => {
              // تحويل النص داخل detail_values من JSON string إلى كائن
              const details = parseObject(item.detail_values);
              const translations = parseObject(item.translations);

              // عرض النص حسب اللغة الحالية أو الإنجليزية كـ fallback
              const value = details[lang] || details.en || Object.values(details).find(Boolean) || "—";

              // عرض الترجمة المناسبة للعنوان
              const label =
                translations[lang] || translations.en || Object.values(translations).find(Boolean) || item.option_key;

              return (
                <tr key={index} className={`border-b ${theme.border}`}>
                  <td
                    className={`py-3 px-4 font-semibold w-1/3 ${theme.heading}`}
                  >
                    {label}
                  </td>
                  <td className={`py-3 px-4 ${theme.subText}`}>{value}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
