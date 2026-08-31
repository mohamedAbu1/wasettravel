"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import Content from "./components/Content";
import DownloadAppSection from "./components/DownloadAppSection";
import { useData } from "@/context/DataContext";
import SocialMediaIcons from "./components/SocialMediaIcons";
import LeftSocialIcons from "./components/LeftSocialIcons";
import LogoLetter from "../LogoLetter";
import Head from "next/head";

export default function HeroSection() {
  const { theme } = useTheme();
  const { images, index } = useData();

  return (
    <>
      {/* ✅ SEO تحسين */}
      <Head>
        <title>Waset Travel - Explore Egypt</title>
        <meta
          name="description"
          content="Discover Egypt with Waset Travel. Private tours, Nile cruises, and authentic experiences guided by certified Egyptologists."
        />
      </Head>

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
                src={images[index] || "/default-hero.jpg"}
                alt="Waset Travel hero background showing Egypt tours"
                fill
                quality={75} // ✅ ضغط الصورة
                sizes="100vw" // ✅ صور متجاوبة
                priority // ✅ تحميل سريع للصورة الأساسية
                placeholder="blur" // ✅ صورة منخفضة الجودة أثناء التحميل
                blurDataURL="/default-hero-blur.jpg" // نسخة مصغرة للتحميل التدريجي
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
          className="relative z-20 flex flex-col items-center justify-center h-full gap-4"
        >
          <Content />
          <DownloadAppSection />

          {/* Logo */}
          <motion.div
            role="heading"
            aria-level={1}
            aria-label="Waset Travel Hero Section"
            initial="hidden"
            animate="visible"
            style={{ background: "rgba(0,0,0,0.4)", borderRadius: "6px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2 },
              },
            }}
            className="flex flex-wrap gap-4 justify-center font-[Cinzel] text-[32px] lg:text-[34px] xl:text-[60px]"
          >
            {["W", "A", "S", "E", "T", "𓂀", "T", "R", "A", "V", "E", "L"].map(
              (char, i) => (
                <LogoLetter key={i} char={char} theme={theme} />
              )
            )}
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
