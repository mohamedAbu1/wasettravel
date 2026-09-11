"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useData } from "@/context/DataContext";
import SocialMediaIcons from "./components/SocialMediaIcons";
import LeftSocialIcons from "./components/LeftSocialIcons";
import LogoLetter from "../LogoLetter";
import dynamic from "next/dynamic";

const Content = dynamic(() => import("./components/Content"), {
  ssr: true,
  loading: () => <div className="h-24 w-full max-w-6xl" aria-hidden="true" />,
});

export default function HeroSection() {
  const { theme } = useTheme();
  const { images, index } = useData();

  return (
    <>
      <section
        className={`relative h-[100vh] w-full overflow-hidden ${theme.background} ${theme.text}`}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <AnimatePresence>
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={images[index] || "/Luxor/pexels-axp-photography-500641970-18934598.webp"}
                alt="Waset Travel hero background showing Egypt tours"
                fill
                quality={75} // ✅ ضغط الصورة
                sizes="100vw" // ✅ صور متجاوبة
                priority // ✅ تحميل سريع للصورة الأساسية
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Overlay */}
        <div className={`absolute inset-0 ${theme.overlay}`} />

        {/* Floating Halo Light */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/10 blur-[120px] rounded-full"
        />

        {/* Social Media Icons */}
        <SocialMediaIcons />

        {/* Left Social Icons */}
        <LeftSocialIcons />

        {/* Content + Logo */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative z-20 flex flex-col items-center justify-center h-full gap-5 px-4 pt-20 lg:pt-24"
        >
          {/* Logo */}
          <motion.div
            role="heading"
            aria-level={1}
            aria-label="Waset Travel Hero Section"
            initial="hidden"
            animate="visible"
            style={{ background: "rgba(0,0,0,0.42)", borderRadius: "12px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2 },
              },
            }}
            className="order-1 flex max-w-full flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4 px-4 py-3 font-serif text-[30px] sm:text-[38px] lg:text-[48px] xl:text-[60px]"
          >
            {["W", "A", "S", "E", "T", "𓂀", "T", "R", "A", "V", "E", "L"].map(
              (char, i) => (
                <LogoLetter key={i} char={char} theme={theme} />
              )
            )}
          </motion.div>
          <Content />
        </motion.div>
      </section>
    </>
  );
}
