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
import Head from "next/head";
import { useLanguage } from "@/context/LanguageContext";
import { contactMetadata } from "@/lib/metadata/contact";
import DividerWithIcon from "@/components/layout/DividerWithIcon";
import { useRouter } from "next/navigation";
import AdminDashboardButton from "@/components/layout/AdminDashboardButton";
import CurrencySelector from "@/components/layout/CurrencySelector";
import SignUpModal from "@/components/home/components/SignUpButton";

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
  const { user } = useAuth();
  const { lang } = useLanguage();
  const meta = contactMetadata[lang] || contactMetadata.en;
  const { t } = useTranslation("contact");
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsSmallScreen(window.innerWidth <= 1024);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          name: user?.name || formData.name,
          email: user?.email || formData.email,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ تم إرسال الرسالة بنجاح!");
      } else {
        alert("❌ حدث خطأ أثناء الإرسال: " + data.error);
      }
    } catch (err) {
      console.error("❌ Error submitting form:", err);
    }
  };

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
      </Head>
      <main
       className="relative flex flex-col min-h-screen justify-center items-center"
      >
        <Header />

        {isSmallScreen ? (
          // ✅ واجهة بديلة للهواتف والشاشات الصغيرة
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col items-center justify-center h-[70vh] text-center gap-6"
          >
            <h2 className="text-4xl font-extrabold text-[#c9a34a] drop-shadow-lg">
              🚫 This page is not available on phones.🚫 
            </h2>
            <p className="text-lg text-gray-600">
              You should go to the homepage to follow your trips
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 rounded-lg bg-[#c9a34a] text-white font-bold shadow-lg hover:bg-yellow-600 transition"
            >
              Return to home page
            </button>
          </motion.div>
        ) : (
          // ✅ التصميم العادي لصفحة التواصل
          <>
            {/* خلفية الرموز الفرعونية */}
            <div className="absolute inset-0 pointer-events-none mt-9">
              {Array.from({ length: 25 }).map((_, i) => (
                <span
                  key={i}
                  className={`absolute ${themeName === "dark" ? "text-gray-700" : "text-[#c9a34a]"} opacity-20 text-7xl animate-pulse`}
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
            <section className="relative z-10 pt-20 px-6 mt-9">
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
                  <DividerWithIcon />
                  <p className="mb-6 opacity-80">{t("p1")}</p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <FaPhoneAlt
                        className={
                          themeName === "dark" ? "text-gold" : "text-[#c9a34a]"
                        }
                      />
                      <span>+20 1091126069</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaEnvelope
                        className={
                          themeName === "dark" ? "text-gold" : "text-[#c9a34a]"
                        }
                      />
                      <span>wasettravel@outlook.com</span>
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
                  <DividerWithIcon />

                  {/* الاسم */}
                  <div>
                    <label className="block mb-2 font-semibold">
                      {t("lb")}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={user?.user_metadata?.name || formData.name}
                      onChange={handleChange}
                      readOnly={!!user?.user_metadata?.name}
                      className={`w-full p-3 rounded-lg border outline-none ${
                        user?.user_metadata?.name
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
                    <label className="block mb-2 font-semibold">
                      {t("lb2")}
                    </label>
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

                  {/* البريد */}
                  <div>
                    <label className="block mb-2 font-semibold">
                      {t("lb3")}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={user?.email || formData.email}
                      onChange={handleChange}
                      readOnly={!!user?.email}
                      className={`w-full p-3 rounded-lg border outline-none ${
                        user?.email
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
                    <label className="block mb-2 font-semibold">
                      {t("lb4")}
                    </label>
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
                </motion.form>
              </div>
            </section>
          </>
        )}

        <Footer />
                <SignUpModal />
        
        <LoginModal />
        {user && <ChatWidget />}
        {user && <AdminDashboardButton />}
                <CurrencySelector />
      </main>
    </>
  );
}
