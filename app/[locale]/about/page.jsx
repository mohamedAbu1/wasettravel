/* eslint-disable react-hooks/purity */
"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer/Footer";

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

export default function AboutPage() {
  const { theme, themeName } = useTheme();

  return (
    <main
      className={`relative w-full min-h-screen ${theme.background} ${theme.text} overflow-hidden pt-10`}
    >
        <Header />
      {/* Hieroglyphic background */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 26 }).map((_, i) => (
          <span
            key={i}
            className={`absolute ${
              themeName === "dark" ? "text-gray-700" : "text-[#c9a34a]"
            } opacity-20 text-7xl`}
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

      {/* Hero */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-5"
          >
            <p
              className={`uppercase tracking-widest text-sm ${
                themeName === "dark" ? "text-white/60" : "text-[#6b4f1d]"
              }`}
            >
              About WasetTravel
            </p>
            <h1
              className={`text-4xl lg:text-5xl font-extrabold leading-tight ${
                themeName === "dark"
                  ? "text-gold"
                  : "bg-gradient-to-r from-[#c9a34a] to-[#eab308] bg-clip-text text-transparent"
              }`}
            >
              Luxury journeys crafted with heritage and heart
            </h1>
            <p
              className={`${
                themeName === "dark" ? "text-white/80" : "text-[#5c4520]"
              } text-lg`}
            >
              We design immersive experiences across Egypt—from the Nile’s
              timeless elegance to the White Desert’s quiet wonder. Every detail
              reflects comfort, culture, and care.
            </p>
            <div className="flex items-center gap-3">
              <div
                className={`h-[2px] w-24 ${
                  themeName === "dark" ? "bg-[#c9a34a]" : "bg-[#c9a34a]/50"
                }`}
              />
              <span
                className={`${
                  themeName === "dark" ? "text-gold" : "text-[#c9a34a]"
                } text-2xl`}
              >
                𓋹
              </span>
              <div
                className={`h-[2px] w-24 ${
                  themeName === "dark" ? "bg-[#c9a34a]" : "bg-[#c9a34a]/50"
                }`}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full h-80 lg:h-[420px] rounded-2xl overflow-hidden shadow-2xl"
            style={{
              boxShadow:
                themeName === "dark"
                  ? "0 12px 32px rgba(201,163,74,0.25)"
                  : "0 12px 32px rgba(58,44,10,0.15)",
            }}
          >
            <Image
              src="/HomePageImage/pexels-radwa-magdy-1718930-21668633.webp"
              alt="WasetTravel Luxury Experience"
              fill
              className="object-cover"
              priority
            />
            <div
              className={`absolute inset-0 bg-gradient-to-t ${
                themeName === "dark"
                  ? "from-black/60 via-black/20 to-transparent"
                  : "from-[#fdf6e3]/70 via-transparent to-transparent"
              }`}
            />
          </motion.div>
        </div>
      </section>

      {/* Mission & values */}
      <section className="relative z-10 py-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            className={`rounded-2xl p-6 border ${
              themeName === "dark"
                ? "border-gold/25 bg-black/30"
                : "border-[#c9a34a]/25 bg-white/60 backdrop-blur-sm"
            }`}
          >
            <h3 className="text-xl font-bold mb-2">Our mission</h3>
            <p
              className={`${
                themeName === "dark" ? "text-white/80" : "text-[#5c4520]"
              }`}
            >
              Elevate travel in Egypt through curated, comfortable, and
              culturally rich experiences.
            </p>
          </div>
          <div
            className={`rounded-2xl p-6 border ${
              themeName === "dark"
                ? "border-gold/25 bg-black/30"
                : "border-[#c9a34a]/25 bg-white/60 backdrop-blur-sm"
            }`}
          >
            <h3 className="text-xl font-bold mb-2">Our values</h3>
            <ul className="space-y-2">
              <li>
                <span
                  className={`${
                    themeName === "dark" ? "text-gold" : "text-[#c9a34a]"
                  }`}
                >
                  •
                </span>{" "}
                Craftsmanship in every detail
              </li>
              <li>
                <span
                  className={`${
                    themeName === "dark" ? "text-gold" : "text-[#c9a34a]"
                  }`}
                >
                  •
                </span>{" "}
                Authentic heritage
              </li>
              <li>
                <span
                  className={`${
                    themeName === "dark" ? "text-gold" : "text-[#c9a34a]"
                  }`}
                >
                  •
                </span>{" "}
                Comfort and care
              </li>
            </ul>
          </div>
          <div
            className={`rounded-2xl p-6 border ${
              themeName === "dark"
                ? "border-gold/25 bg-black/30"
                : "border-[#c9a34a]/25 bg-white/60 backdrop-blur-sm"
            }`}
          >
            <h3 className="text-xl font-bold mb-2">Why choose us</h3>
            <p
              className={`${
                themeName === "dark" ? "text-white/80" : "text-[#5c4520]"
              }`}
            >
              Professional guides, seamless logistics, and designs that honor
              Egypt’s soul.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 py-14 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Years of excellence", value: "10+" },
            { label: "Happy travelers", value: "25K+" },
            { label: "Curated tours", value: "120+" },
            { label: "Partner hotels", value: "60+" },
          ].map((stat, i) => (
            <div
              key={i}
              className={`rounded-2xl p-6 text-center border ${
                themeName === "dark"
                  ? "border-gold/30 bg-black/30"
                  : "border-[#c9a34a]/30 bg-white/70"
              }`}
            >
              <div
                className={`text-3xl font-extrabold ${
                  themeName === "dark" ? "text-gold" : "text-[#c9a34a]"
                }`}
              >
                {stat.value}
              </div>
              <div
                className={`${
                  themeName === "dark" ? "text-white/70" : "text-[#5c4520]"
                }`}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Heritage accent */}
      <section className="relative z-10 pb-20 px-6">
        <div
          className={`max-w-7xl mx-auto rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 border ${
            themeName === "dark"
              ? "border-gold/25 bg-black/40"
              : "border-[#c9a34a]/25 bg-white/70"
          }`}
        >
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-3">
              Rooted in Egyptian heritage
            </h3>
            <p
              className={`${
                themeName === "dark" ? "text-white/80" : "text-[#5c4520]"
              }`}
            >
              Our visual identity embraces hieroglyphic symbolism, gold accents,
              and warm tones—bringing elegance to every touchpoint.
            </p>
          </div>
          <div className="flex-1 relative w-full h-56">
            <Image
              src="/HomePageImage/pexels-axp-photography-500641970-18934598.webp"
              alt="Egyptian Heritage"
              fill
              className="object-cover rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 pb-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h4 className="text-xl font-semibold mb-3">
            Ready to plan your journey?
          </h4>
          <p
            className={`${
              themeName === "dark" ? "text-white/80" : "text-[#5c4520]"
            } mb-6`}
          >
            Let’s craft an itinerary that feels personal, elegant, and
            effortless.
          </p>
          <a
            href="/contact"
            className={`inline-block px-8 py-3 rounded-lg font-bold transition shadow-lg ${
              themeName === "dark"
                ? "bg-[#c9a34a] text-black hover:bg-yellow-500"
                : "bg-[#c9a34a] text-white hover:bg-[#b5892e]"
            }`}
          >
            Contact us
          </a>
        </div>
      </section>
      <Footer />
    </main>
  );
}
