/* eslint-disable react-hooks/purity */
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer/Footer";
import { useTranslation } from "react-i18next";
import LoginModal from "@/components/home/components/LoginModal";
import SignUpButton from "@/components/home/components/SignUpButton";
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

export default function ContactPage() {
  const { theme, themeName } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const { t } = useTranslation("contact");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <main
      className={`relative w-full min-h-screen ${theme.background} ${theme.text} overflow-hidden pt-7`}
    >
      <Header />
      {/* خلفية الرموز الفرعونية */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 25 }).map((_, i) => (
          <span
            key={i}
            className={`absolute ${
              themeName === "dark" ? "text-gray-700" : "text-[#c9a34a]"
            } opacity-20 text-7xl animate-pulse`}
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

      {/* المحتوى */}
      <section className="relative z-10 pt-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* معلومات التواصل */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`rounded-2xl p-8 shadow-xl ${
              themeName === "dark"
                ? "bg-black/40 border border-gold/30"
                : "bg-white/70 border border-[#c9a34a]/30 backdrop-blur-sm"
            }`}
          >
            <h2 className="text-3xl font-bold mb-6">{t("h1")}</h2>
            <p className="mb-6 opacity-80">{t("p1")}</p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaPhoneAlt
                  className={
                    themeName === "dark" ? "text-gold" : "text-[#c9a34a]"
                  }
                />
                <span>+20 123 456 7890</span>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope
                  className={
                    themeName === "dark" ? "text-gold" : "text-[#c9a34a]"
                  }
                />
                <span>info@wasettravel.com</span>
              </div>
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt
                  className={
                    themeName === "dark" ? "text-gold" : "text-[#c9a34a]"
                  }
                />
                <span>{t("sp")}</span>
              </div>
            </div>
          </motion.div>

          {/* فورم التواصل */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`rounded-2xl p-8 shadow-xl space-y-6 ${
              themeName === "dark"
                ? "bg-black/40 border border-gold/30"
                : "bg-white/70 border border-[#c9a34a]/30 backdrop-blur-sm"
            }`}
          >
            <h2 className="text-3xl font-bold mb-6">{t("h2")}</h2>
            <div>
              <label className="block mb-2 font-semibold">{t("lb")}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full p-3 rounded-lg border outline-none ${
                  themeName === "dark"
                    ? "bg-[#0f0f0f] border-gold/30 text-white"
                    : "bg-[#fdf6e3] border-[#c9a34a]/40 text-[#3a2c0a]"
                }`}
                placeholder={t("inp")}
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">{t("lb2")}</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className={`w-full p-3 rounded-lg border outline-none ${
                  themeName === "dark"
                    ? "bg-[#0f0f0f] border-gold/30 text-white"
                    : "bg-[#fdf6e3] border-[#c9a34a]/40 text-[#3a2c0a]"
                }`}
                placeholder={t("inp2")}
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">{t("lb3")}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full p-3 rounded-lg border outline-none ${
                  themeName === "dark"
                    ? "bg-[#0f0f0f] border-gold/30 text-white"
                    : "bg-[#fdf6e3] border-[#c9a34a]/40 text-[#3a2c0a]"
                }`}
                placeholder={t("inp3")}
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">{t("lb4")}</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className={`w-full p-3 rounded-lg border outline-none ${
                  themeName === "dark"
                    ? "bg-[#0f0f0f] border-gold/30 text-white"
                    : "bg-[#fdf6e3] border-[#c9a34a]/40 text-[#3a2c0a]"
                }`}
                placeholder={t("inp4")}
              ></textarea>
            </div>
            <button
              type="submit"
              className={`w-full py-3 rounded-lg font-bold transition shadow-lg ${
                themeName === "dark"
                  ? "bg-[#c9a34a] text-black hover:bg-yellow-500"
                  : "bg-[#c9a34a] text-white hover:bg-[#b5892e]"
              }`}
            >
              {t("btn")}
            </button>
          </motion.form>
        </div>
      </section>
      <Footer />
      <SignUpButton />
      <LoginModal />
    </main>
  );
}
