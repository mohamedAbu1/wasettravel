"use client";
import { FaWheelchair, FaHandsHelping, FaHeart } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import translations from "@/constants/images";

export default function AccessibilityInfo() {
  const { themeName } = useTheme();
  const { lang } = useLanguage(); // ✅ جلب اللغة من الكونتكست
  const isDark = themeName === "dark";

  const t = translations[lang] || translations.en; // fallback للإنجليزية

  return (
    <div
      className={`flex w-[30%] flex-col gap-6 p-8 rounded-2xl shadow-lg transition 
        ${isDark 
          ? "bg-gradient-to-r from-gray-900 to-gray-800 text-gray-100" 
          : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800"}`}
    >
      <div className="space-y-2">
        <h3 className="text-xl font-bold tracking-wide">{t.title}</h3>
        <p className="text-sm leading-relaxed opacity-90">{t.description}</p>
      </div>

      <div className="grid grid-rows-3 gap-4">
        <div className="flex flex-col items-center gap-2 p-4 rounded-xl hover:scale-105 transition transform shadow-md bg-white/10 dark:bg-black/20">
          <FaWheelchair className="text-blue-500 text-4xl" />
          <span className="text-xs font-semibold">{t.accessible}</span>
        </div>

        <div className="flex flex-col items-center gap-2 p-4 rounded-xl hover:scale-105 transition transform shadow-md bg-white/10 dark:bg-black/20">
          <FaHandsHelping className="text-green-500 text-4xl" />
          <span className="text-xs font-semibold">{t.support}</span>
        </div>

        <div className="flex flex-col items-center gap-2 p-4 rounded-xl hover:scale-105 transition transform shadow-md bg-white/10 dark:bg-black/20">
          <FaHeart className="text-red-500 text-4xl" />
          <span className="text-xs font-semibold">{t.care}</span>
        </div>
      </div>
    </div>
  );
}
