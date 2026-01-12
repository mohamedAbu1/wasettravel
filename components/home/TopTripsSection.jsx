/* eslint-disable react-hooks/purity */
"use client";
import Image from "next/image";
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const TopTripsSection = () => {
  const { themeName } = useTheme();

  const symbols = [
    "𓂀","𓋹","𓆣","𓇼","𓇯","𓏏","𓎛","𓊽",
    "𓃾","𓅓","𓈇","𓉐","𓊹","𓌙","𓍿","𓎟",
  ];
  const { t } = useTranslation("home");

  const trips = [
    {
      name: "Luxor & Aswan Nile Cruise",
      img: "/HomePageImage/pexels-axp-photography-500641970-18991537.webp",
      desc: "5 days of luxury sailing through ancient temples.",
      rating: 4.8,
      reviews: 120,
      price: "$499",
    },
    {
      name: "White Desert Adventure",
      img: "/HomePageImage/Copilot_20251003_105902.webp",
      desc: "Explore the magical landscapes of the Sahara.",
      rating: 4.6,
      reviews: 95,
      price: "$399",
    },
    {
      name: "Red Sea Relaxation",
      img: "/HomePageImage/pexels-axp-photography-500641970-18934596.webp",
      desc: "Enjoy crystal-clear waters and premium resorts.",
      rating: 4.7,
      reviews: 180,
      price: "$699",
    },
    {
      name: "Luxor & Aswan Nile Cruise",
      img: "/HomePageImage/pexels-diego-f-parra-33199-15131539.webp",
      desc: "5 days of luxury sailing through ancient temples.",
      rating: 4.8,
      reviews: 120,
      price: "$499",
    },
    {
      name: "White Desert Adventure",
      img: "/HomePageImage/pexels-diego-f-parra-33199-15188088.webp",
      desc: "Explore the magical landscapes of the Sahara.",
      rating: 4.6,
      reviews: 95,
      price: "$399",
    },
    {
      name: "Red Sea Relaxation",
      img: "/HomePageImage/Copilot_20251003_105735.webp",
      desc: "Enjoy crystal-clear waters and premium resorts.",
      rating: 4.7,
      reviews: 180,
      price: "$699",
    },
  ];

  return (
    <section
      className={`hidden lg:flex flex-col relative py-24 px-6 transition-colors duration-500 ${
        themeName === "dark" ? "bg-[#0f0f0f] text-white" : "bg-[#fdf6e3] text-[#3a2c0a]"
      }`}
    >
      {/* خلفية الرموز الفرعونية */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className={`absolute ${
              themeName === "dark" ? "text-gray-700" : "text-[#c9a34a]"
            } opacity-40 text-6xl animate-pulse`}
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

      {/* Title */}
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h2
          className={`text-5xl font-extrabold tracking-wide drop-shadow-md ${
            themeName === "dark"
              ? "text-gold"
              : "bg-gradient-to-r from-[#c9a34a] to-[#eab308] bg-clip-text text-transparent"
          }`}
        >
          {t("TopTrips")}
        </h2>
        <div className="flex items-center gap-3 mt-4 justify-center">
          <div className={`h-[3px] w-20 ${themeName === "dark" ? "bg-[#c9a34a] opacity-10 w-full" : "bg-[#c9a34a]"}`}></div>
          <span className={`text-2xl ${themeName === "dark" ? "text-gold" : "text-[#c9a34a]"}`}>𓋹</span>
          <div className={`h-[3px] w-20 ${themeName === "dark" ? "bg-[#c9a34a] opacity-10 w-full" : "bg-[#c9a34a]/50"}`}></div>
        </div>
      </div>

      {/* Cards باستخدام Flex */}
      <div className="flex flex-wrap justify-center gap-8 max-w-7xl w-full mx-auto">
        {trips.map((trip, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: i * 0.2 }}
            viewport={{ once: true }}
            className={`
              flex-1 basis-full sm:basis-[48%] lg:basis-[30%] xl:basis-[22%]
              relative rounded-2xl overflow-hidden group cursor-pointer
              transition-all duration-500
              hover:scale-[1.05] hover:shadow-2xl hover:-rotate-1
            `}
          >
            {/* صورة */}
            <div className="relative h-72">
              <Image
                src={trip.img}
                alt={trip.name}
                fill
                className="object-cover group-hover:scale-110 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-gold/20 transition duration-500"></div>
            </div>

            {/* محتوى */}
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-400 text-lg font-semibold">⭐ {trip.rating}</span>
                <span className="text-sm opacity-80">({trip.reviews} reviews)</span>
              </div>

              <h3
                className={`text-xl font-bold tracking-wide mb-1 ${
                  themeName === "dark" ? "text-white" : "text-[#3a2c0a]"
                }`}
              >
                {trip.name}
              </h3>

              <p className="text-sm opacity-80 mb-3">{trip.desc}</p>

              <div className="flex items-center justify-between">
                <p
                  className={`text-lg font-semibold ${
                    themeName === "dark" ? "text-gold" : "text-[#c9a34a]"
                  }`}
                >
                  {trip.price}
                </p>
                <button
                  className={`px-5 py-2 rounded-lg font-medium transition ${
                    themeName === "dark"
                      ? "bg-gold text-black hover:bg-yellow-500"
                      : "bg-[#c9a34a] text-white hover:bg-[#b5892e]"}
                  `}
                >
                 {t("BookNow")} 
                </button>
              </div>
            </div>

            {/* Border Glow */}
            <div
              className={`absolute inset-0 rounded-2xl border ${
                themeName === "dark"
                  ? "border-gold/20 group-hover:border-gold/40"
                  : "border-[#c9a34a]/30 group-hover:border-[#c9a34a]/60"
              } transition-all duration-500`}
            ></div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TopTripsSection;
