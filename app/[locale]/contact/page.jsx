/* eslint-disable react-hooks/purity */
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer/Footer";
import { useTranslation } from "react-i18next";
import LoginModal from "@/components/home/components/LoginModal";
import ChatWidget from "@/components/layout/ChatWidget";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import DividerWithIcon from "@/components/layout/DividerWithIcon";
import AdminDashboardButton from "@/components/layout/AdminDashboardButton";
import SignUpModal from "@/components/home/components/SignUpButton";
import { siteConfig } from "@/lib/siteConfig";

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
  const { userData } = useAuth();
  const { lang } = useLanguage();
  const { t } = useTranslation("contact");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });


  const handleChange = (e) =>
    setFormData((current) => ({ ...current, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          name: userData?.name || formData.name,
          email: userData?.email || formData.email,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: "success", message: t("success", { defaultValue: "Your message was sent successfully. We will get back to you shortly." }) });
      } else {
        setStatus({ type: "error", message: data.error || t("error", { defaultValue: "We could not send your message. Please try again." }) });
      }
    } catch {
      setStatus({ type: "error", message: t("error", { defaultValue: "We could not send your message. Please try again." }) });
    }
  };

  return (
    <>
      <main className="relative flex flex-col min-h-screen justify-center items-center overflow-y-hidden">
        <Header />

        <>
          {/* خلفية الرموز الفرعونية */}
          <div className="absolute inset-0 pointer-events-none mt-9">
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                className={`absolute ${themeName === "dark" ? "text-gray-700" : "text-[#8f5d2e]"} opacity-[0.06] text-5xl animate-pulse`}
                  style={{
                  top: `${8 + i * 7}%`,
                  left: `${5 + ((i * 37) % 88)}%`,
                  transform: `rotate(${i * 31}deg)`,
                }}
              >
                {symbols[(i * 7) % symbols.length]}
              </span>
            ))}
          </div>

          {/* المحتوى */}
          <section className="relative z-10 mt-9 px-4 pt-20 sm:px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* معلومات التواصل */}
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={`rounded-2xl p-5 shadow-xl sm:p-8 ${
                  themeName === "dark"
                    ? "bg-black/40 border border-gold/30"
                    : "bg-[#fffaf3] border border-[#8f5d2e]/20 backdrop-blur-sm"
                }`}
              >
                <h2 className="mb-6 text-2xl font-bold sm:text-3xl">{t("h1")}</h2>
                <DividerWithIcon />
                <p className="mb-6 opacity-80">{t("p1")}</p>
                <div className="space-y-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <FaPhoneAlt
                      className={
                        themeName === "dark" ? "text-gold" : "text-[#c9a34a]"
                      }
                    />
                    <a href={`tel:${siteConfig.phone}`} className="min-w-0 break-words transition hover:text-[#c9a34a]">{siteConfig.phone}</a>
                  </div>
                  <div className="flex min-w-0 items-start gap-3">
                    <FaEnvelope
                      className={
                        themeName === "dark" ? "text-gold" : "text-[#c9a34a]"
                      }
                    />
                    <a href={`mailto:${siteConfig.email}`} className="min-w-0 break-words transition hover:text-[#c9a34a]">{siteConfig.email}</a>
                  </div>
                  <div className="flex min-w-0 items-start gap-3">
                    <FaMapMarkerAlt
                      className={
                        themeName === "dark" ? "text-gold" : "text-[#c9a34a]"
                      }
                    />
                    <span className="min-w-0 break-words">{t("sp")}</span>
                  </div>
                  <div className="flex min-w-0 items-start gap-3">
                    <FaMapMarkerAlt
                      className={
                        themeName === "dark" ? "text-gold" : "text-[#c9a34a]"
                      }
                    />
                    <span className="min-w-0 break-words">owner : Mohamed Ahmed Abdelkader Ali </span>
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
                className={`space-y-5 rounded-2xl p-5 shadow-xl sm:space-y-6 sm:p-8 ${
                  themeName === "dark"
                    ? "bg-black/40 border border-gold/30"
                    : "bg-[#fffaf3] border border-[#8f5d2e]/20 backdrop-blur-sm"
                }`}
              >
                <h2 className="mb-6 text-2xl font-bold sm:text-3xl">{t("h2")}</h2>
                <DividerWithIcon />

                {/* الاسم */}
                <div>
                  <label htmlFor="contact-name" className="block mb-2 font-semibold">{t("lb")}</label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    value={userData?.name || formData.name}
                    onChange={handleChange}
                    readOnly={!!userData?.name}
                    className={`w-full p-3 rounded-lg border outline-none ${
                      userData?.name
                        ? "bg-gray-100 text-gray-600 cursor-not-allowed capitalize"
                        : themeName === "dark"
                          ? "bg-[#0f0f0f] border-gold/30 text-white"
                          : "bg-[#fdf6e3] border-[#c9a34a]/40 text-[#3a2c0a]"
                    }`}
                    placeholder={t("inp")}
                  />
                </div>

                {/* الهاتف */}
                <div>
                  <label htmlFor="contact-phone" className="block mb-2 font-semibold">{t("lb2")}</label>
                  <input
                    type="tel"
                    id="contact-phone"
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

                {/* البريد */}
                <div>
                  <label htmlFor="contact-email" className="block mb-2 font-semibold">{t("lb3")}</label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    value={userData?.email || formData.email}
                    onChange={handleChange}
                    readOnly={!!userData?.email}
                    className={`w-full p-3 rounded-lg border outline-none ${
                      userData?.email
                        ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                        : themeName === "dark"
                          ? "bg-[#0f0f0f] border-gold/30 text-white"
                          : "bg-[#fdf6e3] border-[#c9a34a]/40 text-[#3a2c0a]"
                    }`}
                    placeholder={t("inp3")}
                  />
                </div>

                {/* الرسالة */}
                <div>
                  <label htmlFor="contact-message" className="block mb-2 font-semibold">{t("lb4")}</label>
                  <textarea
                    name="message"
                    id="contact-message"
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

                {/* زر الإرسال */}
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
                {status.message ? <p role={status.type === "error" ? "alert" : "status"} aria-live="polite" className={`rounded-lg border px-4 py-3 text-sm font-semibold ${status.type === "error" ? "border-red-400/30 bg-red-400/10 text-red-300" : "border-green-400/30 bg-green-400/10 text-green-300"}`}>{status.message}</p> : null}
              </motion.form>
            </div>
          </section>
        </>

        <Footer />
        <SignUpModal />

        <LoginModal />
        {userData && <ChatWidget />}
        {userData && <AdminDashboardButton />}
      </main>
    </>
  );
}
