/* eslint-disable react-hooks/purity */
"use client";
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { theme, themeName } = useTheme();

  const symbols = [
    "𓂀","𓋹","𓆣","𓇼","𓇯","𓏏","𓎛","𓊽",
    "𓃾","𓅓","𓈇","𓉐","𓊹","𓌙","𓍿","𓎟",
  ];
  const { t } = useTranslation("footer");

  return (
    <footer
      className={`
        flex flex-col items-center justify-center
        py-12 px-6 w-full relative overflow-hidden
        transition-colors duration-500
        ${theme.background} ${theme.text}
      `}
    >
      {/* خلفية الرموز الفرعونية */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className={`absolute ${
              themeName === "dark" ? "text-gray-700" : "text-[#c9a34a]"
            } opacity-20 text-6xl animate-pulse`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          >
            {symbols[Math.floor(Math.random() * symbols.length)]}
          </span>
        ))}
      </div>

      {/* خط زخرفي علوي */}
      <div className="w-full max-w-7xl flex items-center gap-3 mb-8 relative z-10">
        <div
          className={`h-[2px] flex-1 ${
            themeName === "dark" ? "opacity-10 bg-[#c9a34a]" : "bg-[#c9a34a]/40"
          }`}
        ></div>
        <span
          className={`text-xl ${
            themeName === "dark" ? "text-gold" : "text-[#c9a34a]"
          }`}
        >
          𓋹
        </span>
        <div
          className={`h-[2px] flex-1 ${
            themeName === "dark" ? "opacity-10 bg-[#c9a34a]" : "bg-[#c9a34a]/40"
          }`}
        ></div>
      </div>

      {/* اسم البراند */}
      <p
        className={`
          text-2xl font-extrabold tracking-wide drop-shadow-md relative z-10
          ${themeName === "dark" ? "text-gold" : "bg-gradient-to-r from-[#c9a34a] to-[#eab308] bg-clip-text text-transparent"}
        `}
      >
        WasetTravel
      </p>

      {/* الوصف */}
      <p className="mt-2 text-sm opacity-80 text-center max-w-xl relative z-10">
      {t("p")}
      </p>

      {/* روابط سريعة */}
      <div className="flex gap-6 mt-6 text-sm font-medium relative z-10">
        <a
          href="#"
          className={`hover:underline ${
            themeName === "dark" ? "text-white/80 hover:text-gold" : "text-[#3a2c0a]/80 hover:text-[#c9a34a]"
          }`}
        >
          {t("AboutUs")}
        </a>
        <a
          href="#"
          className={`hover:underline ${
            themeName === "dark" ? "text-white/80 hover:text-gold" : "text-[#3a2c0a]/80 hover:text-[#c9a34a]"
          }`}
        >
         {t("Tours")}
        </a>
        <a
          href="#"
          className={`hover:underline ${
            themeName === "dark" ? "text-white/80 hover:text-gold" : "text-[#3a2c0a]/80 hover:text-[#c9a34a]"
          }`}
        >
         {t("Contact")} 
        </a>
      </div>

      {/* أيقونات السوشيال ميديا */}
      <div className="flex gap-5 mt-8 relative z-10">
        <a
          href="#"
          className={`p-3 rounded-full transition ${
            themeName === "dark"
              ? "bg-gold/20 hover:bg-gold/40 text-gold"
              : "bg-[#c9a34a]/20 hover:bg-[#c9a34a]/40 text-[#c9a34a]"
          }`}
        >
          <FaFacebookF />
        </a>
        <a
          href="#"
          className={`p-3 rounded-full transition ${
            themeName === "dark"
              ? "bg-gold/20 hover:bg-gold/40 text-gold"
              : "bg-[#c9a34a]/20 hover:bg-[#c9a34a]/40 text-[#c9a34a]"
          }`}
        >
          <FaInstagram />
        </a>
        <a
          href="#"
          className={`p-3 rounded-full transition ${
            themeName === "dark"
              ? "bg-gold/20 hover:bg-gold/40 text-gold"
              : "bg-[#c9a34a]/20 hover:bg-[#c9a34a]/40 text-[#c9a34a]"
          }`}
        >
          <FaTwitter />
        </a>
        <a
          href="#"
          className={`p-3 rounded-full transition ${
            themeName === "dark"
              ? "bg-gold/20 hover:bg-gold/40 text-gold"
              : "bg-[#c9a34a]/20 hover:bg-[#c9a34a]/40 text-[#c9a34a]"
          }`}
        >
          <FaYoutube />
        </a>

      </div>
    </footer>
  );
};

export default Footer;
