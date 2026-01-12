/* eslint-disable react-hooks/purity */
"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const CitiesSection = () => {
  const { theme, themeName } = useTheme();
  const { t } = useTranslation("home");

  const cities = [
    { name: "Cairo", img: "/HomePageImage/pexels-francesco-albanese-2150950215-31730178.webp" },
    { name: "Luxor", img: "/HomePageImage/Copilot_20251003_105620.webp" },
    { name: "Aswan", img: "/HomePageImage/Copilot_20251003_102123.webp" },
    { name: "Hurghada", img: "/HomePageImage/pexels-frans-van-heerden-201846-631339.webp" },
    { name: "Alexandria", img: "/HomePageImage/pexels-axp-photography-500641970-18934583.webp" },
    { name: "Sharm El Sheikh", img: "/HomePageImage/pexels-axp-photography-500641970-18934596.webp" },
    { name: "Fayoum", img: "/HomePageImage/pexels-diego-f-parra-33199-15131539.webp" },
    { name: "Marsa Alam", img: "/HomePageImage/pexels-diego-f-parra-33199-15188088.webp" },
  ];

  const looped = [...cities, ...cities];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (index >= cities.length) {
      setTimeout(() => setIndex(0), 600);
    }
  }, [index, cities.length]);

  const symbols = ["𓂀", "𓋹", "𓆣", "𓇼", "𓇯", "𓏏", "𓎛", "𓊽"];

  return (
    <section
      className={`
        hidden lg:flex py-12 px-6 flex-col w-full mx-auto relative
         ${
           themeName === "dark"
             ? "bg-[#0f0f0f] text-white"
             : "bg-[#fdf6e3] text-[#3a2c0a]"
         }
        transition-colors duration-300
      `}
    >
      {/* خلفية زخرفية */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 25 }).map((_, i) => (
          <span
            key={i}
            className={`absolute ${
              themeName === "dark" ? "text-gray-700" : "text-[#c9a34a]"
            } opacity-60 text-7xl animate-pulse`}
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

      {/* Title جانبي مع ديكور */}
      <div className="max-w-2xl mx-auto mb-16 w-full">
        <h2
          className={`
            text-5xl font-extrabold tracking-wide drop-shadow-md text-center
            ${
              themeName === "dark"
                ? "text-gold"
                : "bg-gradient-to-r from-[#c9a34a] to-[#eab308] bg-clip-text text-transparent"
            }
          `}
        >
         {t("ExploreCities")} 
        </h2>
        <div className="flex items-center gap-3 mt-4">
          <div
            className={`h-[3px] w-[100%] opacity-10 ${
              themeName === "dark" ? "bg-[#eab308]" : "bg-[#c9a34a]"
            }`}
          ></div>
          <span
            className={`text-2xl ${
              themeName === "dark" ? "text-gold" : "text-[#c9a34a]"
            }`}
          >
            𓋹
          </span>
          <div
            className={`h-[3px]  w-[100%] opacity-10 ${
              themeName === "dark" ? "bg-[#eab308]" : "bg-[#c9a34a]/50"
            }`}
          ></div>
        </div>
      </div>

      {/* Slider مع أنيمشن احترافي */}
      <div className="relative overflow-hidden w-full max-w-7xl mx-auto">
        <div
          className="flex transition-transform duration-[700ms] ease-out"
          style={{
            transform: `translateX(-${index * 33.33}%)`,
          }}
        >
          {looped.map((city, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="min-w-[50%] md:min-w-[33.33%] lg:min-w-[33%] p-4"
            >
              <div
                className={`
                  relative h-56 rounded-2xl overflow-hidden group cursor-pointer
                  ${theme.card} ${theme.border} ${theme.shadow}
                  transition-all duration-500
                  hover:scale-[1.05] hover:shadow-2xl hover:-rotate-1
                `}
              >
                <Image
                  src={city.img}
                  alt={city.name}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-700"
                />

                {/* Overlay + اسم المدينة + زر Explore */}
                <div
                  className={`
                    absolute inset-0 
                    ${theme.overlay}
                    flex flex-col items-center justify-end pb-6
                    transition-all duration-300
                  `}
                >
                  <p className="text-lg font-bold text-white drop-shadow-lg mb-2">
                    {city.name}
                  </p>
                  <button
                    className={`
                      opacity-0 group-hover:opacity-100 px-4 py-2 rounded-lg text-sm font-medium transition
                      ${
                        themeName === "dark"
                          ? "bg-gold text-black hover:bg-yellow-500"
                          : "bg-[#c9a34a] text-white hover:bg-[#b5892e]"
                      }
                    `}
                  >
                   {t("Explore")}
                  </button>
                </div>

                {/* Glow Border */}
                <div className="absolute inset-0 rounded-2xl border border-gold/20 group-hover:border-gold/40 transition-all duration-500"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gold/10 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default CitiesSection;
