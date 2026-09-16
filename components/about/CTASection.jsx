"use client";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function CTASection() {
  const { themeName } = useTheme();
  const { t } = useTranslation("about");

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.25 } }
  };

  return (
    <motion.section
      className="relative z-10 pb-24 px-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerContainer}
    >
      <motion.div variants={staggerContainer} className="max-w-7xl mx-auto text-center">
        <motion.h4
          variants={fadeUp}
          className={`text-xl font-semibold mb-3 ${themeName === "dark" ? "text-gold" : "text-[#8f5d2e]"}`}
        >
          {t("h6")}
        </motion.h4>

        <motion.p
          variants={fadeUp}
          className={`${themeName === "dark" ? "text-white/80" : "text-[#4f3d2d]"} mb-6`}
        >
          {t("p5")}
        </motion.p>

        <motion.a
          variants={fadeUp}
          href={`/${typeof window !== "undefined" ? window.location.pathname.split("/")[1] || "en" : "en"}/contact`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`inline-block px-8 py-3 rounded-lg font-bold transition shadow-lg ${
            themeName === "dark"
              ? "bg-[#c9a34a] text-black hover:bg-yellow-500"
              : "bg-[#8f5d2e] text-white hover:bg-[#6e4523]"
          }`}
        >
          {t("a")}
        </motion.a>
      </motion.div>
    </motion.section>
  );
}
