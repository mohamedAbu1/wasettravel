"use client";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import catalog from "@/lib/imageCatalog";

// ✅ Lazy load للمكون DividerWithIcon
const DividerWithIcon = dynamic(() => import("../layout/DividerWithIcon"), { ssr: false });

export default function HeritageSection() {
  const { themeName } = useTheme();
  const { t } = useTranslation("about");

  const fadeLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const fadeRight = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <motion.section
      role="region"
      aria-label="Egyptian Heritage Section"
      className="relative z-10 pb-20 px-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div
        className={`max-w-7xl mx-auto rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 border ${
          themeName === "dark"
            ? "border-gold/25 bg-black/40"
            : "border-[#8f5d2e]/20 bg-[#fffaf3] shadow-[0_1rem_2.5rem_rgba(78,54,31,.1)]"
        }`}
      >
        <motion.div variants={fadeLeft} className="flex-1">
          <h3
            role="heading"
            aria-level={3}
            aria-label={t("h5")}
            className={`text-2xl font-bold mb-3 ${
              themeName === "dark"
                ? "text-gold"
                : "text-[#8f5d2e]"
            }`}
          >
            {t("h5")}
          </h3>
          <DividerWithIcon />
          <p
            aria-label="Egyptian heritage description"
            className={`${themeName === "dark" ? "text-white/80" : "text-[#4f3d2d]"}`}
          >
            {t("p4")}
          </p>
        </motion.div>

        <motion.div variants={fadeRight} className="flex-1 relative w-full h-56">
          <Image
            src={catalog.about}
            alt="Ancient Egyptian heritage site with Waset Travel"
            fill
            quality={75}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            loading="lazy" // ✅ تحميل مؤجل للصور الثانوية
            placeholder="blur"
            blurDataURL="/HomePageImage/apple-touch-icon.png"
            className="object-cover rounded-2xl"
          />
        </motion.div>
      </div>
    </motion.section>
  );
}
