/* eslint-disable react-hooks/purity */
"use client";
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { FaCarSide } from "react-icons/fa";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const CarBookingSection = () => {
  const { themeName } = useTheme();
  const { t } = useTranslation("home");

  const symbols = [
    "𓂀","𓋹","𓆣","𓇼","𓇯","𓏏","𓎛","𓊽",
    "𓃾","𓅓","𓈇","𓉐","𓊹","𓌙","𓍿","𓎟",
  ];

  // ✨ إعدادات الأنيميشن
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeInUp}
      className={`hidden lg:flex relative w-full items-center justify-center py-24 px-6 transition-colors duration-500 overflow-hidden ${
        themeName === "dark"
          ? "bg-[#0f0f0f] text-white"
          : "bg-[#fdf6e3] text-[#3a2c0a]"
      }`}
    >
      {/* Background Car Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/HomePageImage/Copilot_20251003_105735.webp"
          alt="Luxury Car Background"
          fill
          className="object-cover opacity-20"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-br ${
            themeName === "dark"
              ? "from-black/70 via-transparent to-black/10"
              : "from-[#fdf6e3]/80 via-transparent to-[#c9a34a]/20"
          }`}
        ></div>
      </div>

      {/* Hieroglyphic Symbols Background */}
      <div className="absolute inset-0 pointer-events-none -z-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className={`absolute ${
              themeName === "dark" ? "text-[#c9a34a]" : "text-[#c9a34a]"
            } opacity-30 text-6xl animate-pulse`}
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

      {/* Content with Car beside text */}
      <motion.div
        variants={fadeInUp}
        className="flex flex-col lg:flex-row items-center gap-12 max-w-7xl w-full mx-auto"
      >
        {/* Car Image beside text */}
        <motion.div
          variants={fadeInUp}
          className="flex-1 relative w-full h-80 lg:h-[400px]"
        >
          <Image
            src="/HomePageImage/car-png-39057.png"
            alt="Luxury Car"
            fill
            className="object-contain drop-shadow-2xl"
          />
        </motion.div>

        {/* Text Section */}
        <motion.div
          variants={fadeInUp}
          className="flex-1 text-center lg:text-left"
        >
          <h2
            className={`text-5xl font-extrabold tracking-wide drop-shadow-md flex items-center gap-3 justify-center lg:justify-start ${
              themeName === "dark"
                ? "text-gold"
                : "bg-gradient-to-r from-[#c9a34a] to-[#eab308] bg-clip-text text-transparent"
            }`}
          >
            {t("PremiumCarTransfer")}
          </h2>
          <p className="mt-6 text-lg opacity-80 leading-relaxed max-w-xl">
            {t("Experience")}
          </p>

          {/* Booking Button */}
          <motion.a
            variants={fadeInUp}
            href="/car-booking"
            className={`mt-8 inline-block px-10 py-4 rounded-full font-bold text-lg shadow-xl transition-transform transform hover:scale-105 ${
              themeName === "dark"
                ? "bg-amber-300 text-black hover:bg-yellow-500"
                : "bg-[#c9a34a] text-white hover:bg-[#b5892e]"
            }`}
          >
            {t("Book")}
          </motion.a>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default CarBookingSection;
