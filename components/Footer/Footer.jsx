/* eslint-disable react-hooks/purity */
"use client";
import React, { useMemo } from "react";
import { useTheme } from "@/context/ThemeContext";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Link from "next/link";

// ✅ Lazy load للأيقونات
const FaFacebookF = dynamic(() => import("react-icons/fa").then(mod => mod.FaFacebookF), { ssr: false });
const FaInstagram = dynamic(() => import("react-icons/fa").then(mod => mod.FaInstagram), { ssr: false });
const FaWhatsapp = dynamic(() => import("react-icons/fa").then(mod => mod.FaWhatsapp), { ssr: false });
const FaTiktok = dynamic(() => import("react-icons/fa").then(mod => mod.FaTiktok), { ssr: false });
const FaBlogger = dynamic(() => import("react-icons/fa").then(mod => mod.FaBlogger), { ssr: false });
const MdEmail = dynamic(() => import("react-icons/md").then(mod => mod.MdEmail), { ssr: false });

// ✅ دالة لتشفير الكويري
const encodeQuery = (queryObj) => {
  const str = JSON.stringify(queryObj);
  return Buffer.from(str).toString("base64");
};

const Footer = () => {
  const { theme, themeName } = useTheme();
  const { t } = useTranslation("footer","cancellationPolicy");

  const symbols = [
    "𓂀","𓋹","𓆣","𓇼","𓇯","𓏏","𓎛","𓊽","𓃾","𓅓","𓈇","𓉐","𓊹","𓌙","𓍿","𓎟",
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  // ✅ كويري افتراضي للـ Trips
  const tripsQuery = encodeQuery({
    city: "all",
    category: "all",
    price: "All",
    popular: false,
  });

  // ✅ خلفية الرموز ثابتة باستخدام useMemo
  const positions = useMemo(() =>
    Array.from({ length: 20 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      rotate: `${Math.random() * 360}deg`,
    })), []
  );

  return (
    <motion.footer
      role="contentinfo"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerContainer}
      className={`
        flex flex-col items-center justify-center
        py-12 px-6 w-full relative overflow-hidden
        transition-colors duration-500
        ${theme.background} ${theme.text}
      `}
    >
      {/* خلفية الرموز */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        {positions.map((pos, i) => (
          <span
            key={i}
            className={`absolute ${themeName === "dark" ? "text-gray-700" : "text-[#c9a34a]"} opacity-20 text-6xl animate-pulse`}
            style={{
              top: pos.top,
              left: pos.left,
              transform: `rotate(${pos.rotate})`,
            }}
          >
            {symbols[Math.floor(Math.random() * symbols.length)]}
          </span>
        ))}
      </div>

      {/* اسم البراند */}
      <motion.p
        variants={fadeUp}
        aria-label="Waset Travel brand name"
        className={`
          text-2xl font-extrabold tracking-wide drop-shadow-md relative z-10
          ${themeName === "dark" 
            ? "text-gold" 
            : "bg-gradient-to-r from-[#c9a34a] to-[#eab308] bg-clip-text text-transparent"}
        `}
      >
        WasetTravel
      </motion.p>

      {/* الوصف */}
      <motion.p
        variants={fadeUp}
        aria-label="Footer description"
        className="mt-2 text-sm opacity-80 text-center max-w-xl relative z-10"
      >
        {t("p")}
      </motion.p>

      {/* روابط سريعة */}
      <motion.div
        variants={fadeUp}
        className="flex flex-wrap gap-6 mt-6 text-sm font-medium relative z-10 justify-center"
      >
        <Link href="/" aria-label="Go to Home page" className="hover:underline" prefetch={false}>{t("Home")}</Link>
        <Link href="/about" aria-label="Learn more about Waset Travel" className="hover:underline" prefetch={false}>{t("AboutUs")}</Link>
        <Link href={`/trips?data=${tripsQuery}`} aria-label="Browse available tours" className="hover:underline">{t("Tours")}</Link>
        <Link href="/contact" aria-label="Contact Waset Travel" className="hover:underline" prefetch={false}>{t("Contact")}</Link>
        <Link href="/privacyPolicy" aria-label="Read our privacy policy" className="hover:underline" prefetch={false}>{t("privacyPolicy")}</Link>
        <Link href="/cancellationPolicy" aria-label="Read our cancellation policy" className="hover:underline" prefetch={false}>{t("cancellationPolicy")}</Link>
      </motion.div>

      {/* أيقونات السوشيال ميديا */}
      <motion.div variants={fadeUp} className="flex gap-5 mt-8 relative z-10">
        <a href="https://www.facebook.com/share/1BTkjPD5Sd/" target="_blank" rel="noopener noreferrer" aria-label="Visit our Facebook page"
          className={`p-3 rounded-full transition ${themeName === "dark" ? "bg-gold/20 hover:bg-gold/40 text-gold" : "bg-[#c9a34a]/20 hover:bg-[#c9a34a]/40 text-[#c9a34a]"}`}>
          <FaFacebookF />
        </a>
        <a href="https://www.instagram.com/kader.mohameda" target="_blank" rel="noopener noreferrer" aria-label="Visit our Instagram page"
          className={`p-3 rounded-full transition ${themeName === "dark" ? "bg-gold/20 hover:bg-gold/40 text-gold" : "bg-[#c9a34a]/20 hover:bg-[#c9a34a]/40 text-[#c9a34a]"}`}>
          <FaInstagram />
        </a>
        <a href="https://wa.me/qr/WIFIQJUBO2PJH1" target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp"
          className={`p-3 rounded-full transition ${themeName === "dark" ? "bg-gold/20 hover:bg-gold/40 text-gold" : "bg-[#c9a34a]/20 hover:bg-[#c9a34a]/40 text-[#c9a34a]"}`}>
          <FaWhatsapp />
        </a>
        <a href="mailto:info@wasettravel.com" target="_blank" rel="noopener noreferrer" aria-label="Send us an email"
          className={`p-3 rounded-full transition ${themeName === "dark" ? "bg-gold/20 hover:bg-gold/40 text-gold" : "bg-[#c9a34a]/20 hover:bg-[#c9a34a]/40 text-[#c9a34a]"}`}>
          <MdEmail />
        </a>
        <a href="https://www.tiktok.com/@mohamedakader25" target="_blank" rel="noopener noreferrer" aria-label="Follow us on TikTok"
          className={`p-3 rounded-full transition ${themeName === "dark" ? "bg-gold/20 hover:bg-gold/40 text-gold" : "bg-[#c9a34a]/20 hover:bg-[#c9a34a]/40 text-[#c9a34a]"}`}>
          <FaTiktok />
        </a>
        <a href="https://wasettravel.blogspot.com" target="_blank" rel="noopener noreferrer" aria-label="Read our blog on Blogger"
          className={`p-3 rounded-full transition ${themeName === "dark" ? "bg-gold/20 hover:bg-gold/40 text-gold" : "bg-[#c9a34a]/20 hover:bg-[#c9a34a]/40 text-[#c9a34a]"}`}>
          <FaBlogger />
        </a>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
