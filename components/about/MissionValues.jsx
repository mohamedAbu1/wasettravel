"use client";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// ✅ Lazy load للمكون DividerWithIcon
const DividerWithIcon = dynamic(() => import("../layout/DividerWithIcon"), { ssr: false });

export default function MissionValues() {
  const { themeName } = useTheme();
  const { t } = useTranslation("about");

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  return (
    <motion.section
      role="region"
      aria-label="Mission and Values Section"
      className="relative z-10 py-8 px-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer}
    >
      <motion.div
        variants={staggerContainer}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {/* Mission */}
        <motion.div variants={fadeUp} className={`rounded-2xl p-6 border ${themeName === "dark" ? "border-gold/25 bg-black/30" : "border-[#8f5d2e]/20 bg-[#fffaf3] shadow-[0_.8rem_2rem_rgba(78,54,31,.08)]"}`}>
          <h3 role="heading" aria-level={3} aria-label={t("h3")} className={`text-xl font-bold mb-2 ${themeName === "dark" ? "text-gold" : "text-[#8f5d2e]"}`}>
            {t("h3")}
          </h3>
          <DividerWithIcon />
          <p aria-label="Mission statement text" className={`${themeName === "dark" ? "text-white/80" : "text-[#4f3d2d]"}`}>
            {t("p2")}
          </p>
          <DividerWithIcon />
        </motion.div>

        {/* Values */}
        <motion.div variants={fadeUp} className={`rounded-2xl p-6 border ${themeName === "dark" ? "border-gold/25 bg-black/30" : "border-[#8f5d2e]/20 bg-[#fffaf3] shadow-[0_.8rem_2rem_rgba(78,54,31,.08)]"}`}>
          <h3 role="heading" aria-level={3} aria-label={t("h2")} className={`text-xl font-bold mb-2 ${themeName === "dark" ? "text-gold" : "text-[#8f5d2e]"}`}>
            {t("h2")}
          </h3>
          <DividerWithIcon />
          <p aria-label="Values description text" className={`${themeName === "dark" ? "text-white/80" : "text-[#4f3d2d]"}`}>
            {t("li")}
          </p>
          <DividerWithIcon />
        </motion.div>

        {/* Vision */}
        <motion.div variants={fadeUp} className={`rounded-2xl p-6 border ${themeName === "dark" ? "border-gold/25 bg-black/30" : "border-[#8f5d2e]/20 bg-[#fffaf3] shadow-[0_.8rem_2rem_rgba(78,54,31,.08)]"}`}>
          <h3 role="heading" aria-level={3} aria-label={t("h4")} className={`text-xl font-bold mb-2 ${themeName === "dark" ? "text-gold" : "text-[#8f5d2e]"}`}>
            {t("h4")}
          </h3>
          <DividerWithIcon />
          <p aria-label="Vision statement text" className={`${themeName === "dark" ? "text-white/80" : "text-[#4f3d2d]"}`}>
            {t("p3")}
          </p>
          <DividerWithIcon />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
