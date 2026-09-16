"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import catalog from "@/lib/imageCatalog";

// ✅ Lazy load للمكون DividerWithIcon
const DividerWithIcon = dynamic(() => import("../layout/DividerWithIcon"), { ssr: false });

export default function AboutHero() {
  const { themeName } = useTheme();
  const { t } = useTranslation("about");

  return (
    <section className="about-hero relative z-10 mt-9 px-5 py-20 sm:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-5"
        >
          <p className={`about-kicker uppercase tracking-widest text-sm ${themeName === "dark" ? "text-white/60" : "text-[#6e4523]"}`}>
            {t("AboutWasetTravel")}
          </p>
          <h1
            role="heading"
            aria-level={1}
            aria-label={t("h1")}
            className={`about-hero__title text-4xl lg:text-5xl font-extrabold leading-tight ${
              themeName === "dark"
                ? "text-gold"
                : "text-[#8f5d2e]"
            }`}
          >
            {t("h1")}
          </h1>
          <p
            aria-label="About Waset Travel introduction"
            className={`${themeName === "dark" ? "text-white/80" : "text-[#4f3d2d]"} text-lg`}
          >
            {t("p")}
          </p>
          <div className="about-hero__proof"><span>𓂀</span><p>Authentic journeys shaped by local knowledge and thoughtful care.</p></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="about-hero__media relative h-80 w-full overflow-hidden rounded-[1.5rem] shadow-2xl lg:h-[460px]"
        >
          <Image
            src={catalog.hero}
            alt="Travelers exploring Egypt with Waset Travel"
            fill
            quality={75}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
            priority // ✅ الصورة الأساسية فقط
            placeholder="blur"
            blurDataURL="/HomePageImage/apple-touch-icon.png"
            className="object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
