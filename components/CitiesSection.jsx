"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

const CitiesSection = () => {
  const { theme } = useTheme();

  const cities = [
    { name: "Cairo", img: "/adssadasda.webp" },
    { name: "Luxor", img: "/adssadasda.webp" },
    { name: "Aswan", img: "/adssadasda.webp" },
    { name: "Hurghada", img: "/adssadasda.webp" },
    { name: "Alexandria", img: "/adssadasda.webp" },
    { name: "Sharm El Sheikh", img: "/adssadasda.webp" },
    { name: "Fayoum", img: "/adssadasda.webp" },
    { name: "Marsa Alam", img: "/adssadasda.webp" },
  ];

  // نكرر القائمة مرتين لعمل infinite loop
  const looped = [...cities, ...cities];

  const [index, setIndex] = useState(0);

  // Auto Slide
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Reset index عند الوصول لنهاية النسخة الأولى
  useEffect(() => {
    if (index >= cities.length) {
      setTimeout(() => setIndex(0), 600);
    }
  }, [index, cities.length]);

  return (
    <section
      className={` hidden md:flex
        py-24 px-6 w-full mx-auto relative
        ${theme.background} ${theme.text}
        transition-colors duration-300
      `}
    >
      {/* Title */}
      <h2 className="text-4xl font-extrabold text-gold mb-14 text-center tracking-wide drop-shadow-md">
        Explore Cities
      </h2>

      {/* Slider */}
      <div className="relative overflow-hidden w-full max-w-7xl mx-auto">
        <div
          className="flex transition-transform duration-[700ms] ease-out"
          style={{
            transform: `translateX(-${index * 33.33}%)`,
          }}
        >
          {looped.map((city, i) => (
            <div
              key={i}
              className="min-w-[50%] md:min-w-[33.33%] lg:min-w-[33%] p-4"
            >
              <div
                className={`
                  relative h-48 rounded-2xl overflow-hidden group cursor-pointer
                  ${theme.card} ${theme.border} ${theme.shadow}
                  transition-all duration-500
                  hover:scale-[1.06] hover:shadow-2xl hover:-rotate-1
                `}
              >
                {/* Image */}
                <Image
                  src={city.img}
                  alt={city.name}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-700"
                />

                {/* Overlay */}
                <div
                  className={`
                    absolute inset-0 
                    ${theme.overlay}
                    flex items-end justify-center pb-4
                    transition-all duration-300
                  `}
                >
                  <p className="text-lg font-bold text-white drop-shadow-lg">
                    {city.name}
                  </p>
                </div>

                {/* Glow Border */}
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

export default CitiesSection;
