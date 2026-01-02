/* eslint-disable react-hooks/purity */
"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

const CategoriesSection = () => {
  const { theme, themeName } = useTheme();

  const categories = [
    {
      name: "Nile Cruises",
      img: "/HomePageImage/pexels-oualid-soussi-2150533856-35050672.webp",
    },
    {
      name: "Desert Tours",
      img: "/HomePageImage/pexels-furknsaglam-1596977-21348185.webp",
    },
    {
      name: "Historical Sites",
      img: "/HomePageImage/pexels-ozgomz-7566890.webp",
    },
    {
      name: "Beach Resorts",
      img: "/HomePageImage/pexels-radwa-magdy-1718930-21668633.webp",
    },
    {
      name: "Adventure Trips",
      img: "/HomePageImage/pexels-yasmine-qasem-1054896-2034684.webp",
    },
    {
      name: "Cultural Tours",
      img: "/HomePageImage/pexels-oualid-soussi-2150533856-35050672.webp",
    },
    {
      name: "Luxury Hotels",
      img: "/HomePageImage/pexels-furknsaglam-1596977-21348185.webp",
    },
    {
      name: "Safari Experience",
      img: "/HomePageImage/pexels-ozgomz-7566890.webp",
    },
    {
      name: "Temple Visits",
      img: "/HomePageImage/pexels-radwa-magdy-1718930-21668633.webp",
    },
    {
      name: "City Walks",
      img: "/HomePageImage/pexels-yasmine-qasem-1054896-2034684.webp",
    },
  ];

  const looped = [...categories, ...categories];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (index >= categories.length) {
      setTimeout(() => setIndex(0), 600);
    }
  }, [index, categories.length]);

  // رموز فرعونية كديكور
  const symbols = [
    "𓂀",
    "𓋹",
    "𓆣",
    "𓇼",
    "𓇯",
    "𓏏",
    "𓎛",
    "𓊽",
    "𓃾",
    "𓅓",
    "𓈇",
    "𓉐",
    "𓊹",
    "𓌙",
    "𓍿",
    "𓎟",
  ];

  return (
    <section
      className={` hidden lg:flex flex-col
        py-24 px-6 w-full mx-auto relative
        transition-colors duration-500
        ${
          themeName === "dark"
            ? "bg-[#0f0f0f] text-white"
            : "bg-[#fdf6e3] text-[#3a2c0a]"
        }
      `}
    >
      {/* رموز فرعونية في الخلفية */}
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

      {/* Title */}
      <div className="max-w-7xl mx-auto mb-10 text-start">
        <h2
          className={`
            text-5xl font-extrabold tracking-wide drop-shadow-md text-left
            ${
              themeName === "dark"
                ? "text-gold"
                : "bg-gradient-to-r from-[#c9a34a] to-[#eab308] bg-clip-text text-transparent"
            }
          `}
        >
          Explore Categories
        </h2>
        <p className="mt-4 text-lg opacity-80 text-start">
          Discover unique journeys crafted for unforgettable memories
        </p>
        <div className="flex items-center text-left gap-3 mt-4 ">
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
            className={`h-[3px]  w-full opacity-10  ${
              themeName === "dark" ? "bg-[#eab308]" : "bg-[#c9a34a]/50"
            }`}
          ></div>
        </div>
      </div>

      {/* Slider */}
      <div className="relative overflow-hidden w-full max-w-7xl mx-auto">
        <div
          className="flex transition-transform duration-[700ms] ease-out"
          style={{
            transform: `translateX(-${index * 20}%)`, // 5 كروت = 20% لكل كارت
          }}
        >
          {looped.map((cat, i) => (
            <div
              key={i}
              className="min-w-[100%] sm:min-w-[50%] md:min-w-[33.33%] lg:min-w-[20%] p-3"
            >
              <div
                className={`
                  relative rounded-2xl overflow-hidden group cursor-pointer h-[320px]
                  transition-all duration-500
                  hover:scale-[1.06] hover:shadow-2xl
                  ${
                    themeName === "dark"
                      ? "bg-[#1a1a1a] border border-gold/20 shadow-lg"
                      : "bg-[#fff8e1] border border-[#c9a34a]/30 shadow-md"
                  }
                `}
              >
                {/* صورة الكارت */}
                <Image
                  src={cat.img}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-700"
                />

                {/* Overlay */}
                <div
                  className={`
                    absolute inset-0 
                    bg-gradient-to-t ${
                      themeName === "dark"
                        ? "from-black/60"
                        : "from-[#fdf6e3]/70"
                    } via-transparent to-transparent
                    flex items-end justify-center pb-4
                    transition-colors duration-300
                    group-hover:bg-gradient-to-t group-hover:from-gold/30 group-hover:via-transparent group-hover:to-transparent
                  `}
                >
                  <p
                    className={`
                      text-lg font-bold tracking-wide drop-shadow-lg
                      ${themeName === "dark" ? "text-white" : "text-[#3a2c0a]"}
                    `}
                  >
                    {cat.name}
                  </p>
                </div>

                {/* Border Glow */}
                <div
                  className={`absolute inset-0 rounded-2xl border ${
                    themeName === "dark"
                      ? "border-gold/20 group-hover:border-gold/40"
                      : "border-[#c9a34a]/30 group-hover:border-[#c9a34a]/60"
                  } transition-all duration-500`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
