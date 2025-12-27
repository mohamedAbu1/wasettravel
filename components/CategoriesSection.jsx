"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

const CategoriesSection = () => {
  const { theme } = useTheme();

  const categories = [
    { name: "Nile Cruises", img: "/adssadasda.webp" },
    { name: "Desert Tours", img: "/Copilot_20251003_102123.webp" },
    { name: "Historical Sites", img: "/Copilot_20251003_105620.webp" },
    { name: "Beach Resorts", img: "/download.webp" },
    { name: "Adventure Trips", img: "/adventure.webp" },
    { name: "Cultural Tours", img: "/culture.webp" },
    { name: "Luxury Hotels", img: "/luxury.webp" },
    { name: "Safari Experience", img: "/safari.webp" },
    { name: "Temple Visits", img: "/temple.webp" },
    { name: "City Walks", img: "/citywalk.webp" },
  ];

  const looped = [...categories, ...categories];

  const [index, setIndex] = useState(0);

  // Auto Slide
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Reset for infinite loop
  useEffect(() => {
    if (index >= categories.length) {
      setTimeout(() => setIndex(0), 600);
    }
  }, [index, categories.length]);

  return (
    <section
      className={`
        py-24 px-6 w-full mx-auto relative
        ${theme.background} ${theme.text}
        transition-colors duration-300
      `}
    >
      {/* Artistic Glow Behind Title */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-gold/10 blur-[120px] rounded-full"></div>

      {/* Title + Decorative Lines */}
      {/* Title + Lines */}
      <div className="max-w-7xl mx-auto mb-14">
        <div className="flex flex-col items-start gap-4">
          <h2 className="text-4xl font-extrabold text-gold tracking-wide drop-shadow-md">
            Explore Categories
          </h2>

          {/* Lines */}
          <div className="flex flex-col gap-2 mt-1">
            {/* Line 1 */}
            <div className="w-40 h-1.5 bg-gold/20 rounded-full overflow-hidden">
              <div className="h-full bg-gold rounded-full animate-fill-fast"></div>
            </div>

            {/* Line 2 */}
            <div className="w-28 h-1.5 bg-gold/15 rounded-full overflow-hidden">
              <div className="h-full bg-gold/90 rounded-full animate-fill-medium"></div>
            </div>

            {/* Line 3 */}
            <div className="w-16 h-1.5 bg-gold/10 rounded-full overflow-hidden">
              <div className="h-full bg-gold/80 rounded-full animate-fill-slow"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="relative overflow-hidden w-full max-w-7xl mx-auto">
        <div
          className="flex transition-transform duration-[700ms] ease-out"
          style={{
            transform: `translateX(-${index * 33.33}%)`,
          }}
        >
          {looped.map((cat, i) => (
            <div
              key={i}
              className="min-w-[50%] md:min-w-[33.33%] lg:min-w-[33%] p-4"
            >
              <div
                className={`
                  relative h-48 rounded-2xl overflow-hidden group cursor-pointer
                  ${theme.card} ${theme.border} ${theme.shadow}
                  transition-all duration-500
                  hover:scale-[1.06] hover:shadow-2xl
                  hover:-rotate-1
                `}
              >
                {/* Soft Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>

                {/* Image */}
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
                    ${theme.overlay}
                    flex items-end justify-center pb-4
                    transition-colors duration-300
                  `}
                >
                  <p className="text-lg font-bold text-white tracking-wide drop-shadow-lg">
                    {cat.name}
                  </p>
                </div>

                {/* Artistic Border Glow */}
                <div className="absolute inset-0 rounded-2xl border border-gold/20 group-hover:border-gold/40 transition-all duration-500"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gold/10 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default CategoriesSection;
