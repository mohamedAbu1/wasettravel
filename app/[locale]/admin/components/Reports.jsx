import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { FaChartBar } from "react-icons/fa";
import EgyptianBackground from "@/components/trips/EgyptianBackground";

export default function Reports() {
  const { themeName } = useTheme();

  return (
    <div
      className={`rounded-xl shadow-lg p-6 transition transform hover:scale-[1.01] ${
        themeName === "dark"
          ? "bg-black/40 border border-gold/30 text-white"
          : "bg-white/70 border border-[#c9a34a]/30 text-[#3a2c0a] backdrop-blur-sm"
      }`}
    >
      <EgyptianBackground />

      <h2
        className={`flex items-center gap-2 text-2xl font-bold mb-4 ${
          themeName === "dark"
            ? "text-gold"
            : "bg-gradient-to-r from-[#c9a34a] to-[#eab308] bg-clip-text text-transparent"
        }`}
      >
        <FaChartBar /> Reports
      </h2>

      <div
        className={`rounded-lg p-6 text-center ${
          themeName === "dark"
            ? "bg-[#0f0f0f] border border-gold/30 text-gray-300"
            : "bg-[#fdf6e3] border border-[#c9a34a]/30 text-[#3a2c0a]"
        }`}
      >
        <p className="text-lg font-semibold">Charts and analytics go here...</p>
        <div
          className={`mt-4 h-40 rounded-lg flex items-center justify-center ${
            themeName === "dark" ? "bg-black/60" : "bg-white/60"
          }`}
        >
          <span
            className={`italic ${
              themeName === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            (Placeholder for charts)
          </span>
        </div>
      </div>
    </div>
  );
}
