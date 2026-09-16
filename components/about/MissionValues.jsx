"use client";

import { FaCompass, FaCrown, FaHandsHelping, FaMapMarkedAlt, FaShieldAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";

export default function MissionValues() {
  const { themeName } = useTheme();
  const { t } = useTranslation("about");
  const features = [
    { icon: FaCompass, title: t("li"), text: t("liText") },
    { icon: FaCrown, title: t("li2"), text: t("li2Text") },
    { icon: FaHandsHelping, title: t("li3"), text: t("li3Text") },
    { icon: FaShieldAlt, title: t("li4"), text: t("li4Text") },
  ];

  return (
    <section className="about-features relative z-10 px-5 py-10 sm:px-8" aria-labelledby="about-why-title">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-2xl"><p className="stone-kicker mb-3">The Waset standard</p><h2 id="about-why-title" className={`text-3xl font-bold tracking-tight sm:text-4xl ${themeName === "dark" ? "text-white" : "text-[#30271d]"}`}>{t("h3")}</h2></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }, index) => (
            <motion.article key={title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ delay: index * .08 }} className="about-feature-card">
              <span className="about-feature-card__icon"><Icon /></span><h3>{title}</h3><p>{text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
