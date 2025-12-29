"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
  FaGooglePlay,
  FaApple,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useTheme } from "@/context/ThemeContext";
import Content from "./Content";
import DownloadAppSection from "./DownloadAppSection";
import SignUpButton from "./SignUpButton";

export default function HeroSection() {
  const { theme } = useTheme();

  const desktopImages = [
    "/HomePageImage/pexels-axp-photography-500641970-18934598.webp",
    "/HomePageImage/pexels-axp-photography-500641970-18934596.webp",
    "/HomePageImage/pexels-axp-photography-500641970-18991537.webp",
    "/HomePageImage/pexels-frans-van-heerden-201846-631339.webp",
    "/HomePageImage/pexels-diego-f-parra-33199-15131539.webp",
    "/HomePageImage/pexels-francesco-albanese-2150950215-31730178.webp",
  ];

  const mobileImages = [
    "/HomePageImage/pexels-oualid-soussi-2150533856-35050672.webp",
    "/HomePageImage/pexels-ozgomz-7566890.webp",
    "/HomePageImage/pexels-furknsaglam-1596977-21348185.webp",
    "/HomePageImage/pexels-yasmine-qasem-1054896-2034684.webp",
    "/HomePageImage/pexels-radwa-magdy-1718930-21668633.webp",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);
  const [images, setImages] = useState(desktopImages);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setImages(mobileImages);
      } else {
        setImages(desktopImages);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
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
              src={images[index]}
              alt="WasetTravel Slide"
              fill
              priority
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
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="hidden absolute right-10 top-1/2 -translate-y-1/2 md:flex flex-col gap-6 z-30"
      >
        {[
          { Icon: FaGooglePlay, link: "https://play.google.com" },
          { Icon: FaApple, link: "https://apple.com" },
        ].map(({ Icon, link }, i) => (
          <motion.a
            whileHover={{ scale: 1.2, rotate: 5 }}
            key={i}
            href={link}
            target="_blank"
            className={`p-3 rounded-full ${theme.card} ${theme.shadow}`}
          >
            <Icon size={22} className={theme.icon} />
          </motion.a>
        ))}
      </motion.div>

      {/* Left Social Icons */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="absolute left-10 bottom-0 md:top-1/2 -translate-y-1/2 flex flex-row md:flex-col gap-6 z-30"
      >
        {[FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp, MdEmail].map(
          (Icon, i) => (
            <motion.a
              whileHover={{ scale: 1.2, rotate: -5 }}
              key={i}
              href="#"
              className={`p-3 rounded-full ${theme.card} ${theme.shadow}`}
            >
              <Icon size={22} className={theme.icon} />
            </motion.a>
          )
        )}
      </motion.div>

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
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 },
            },
          }}
          className="flex flex-wrap gap-4 justify-center font-[Cinzel] text-[32px] lg:text-[64px]"
        >
          {["W", "A", "S", "E", "T", "𓂀", "T", "R", "A", "V", "E", "L"].map(
            (char, i) => (
              <LogoLetter key={i} char={char} theme={theme} />
            )
          )}
        </motion.div>
      </motion.div>

      <SignUpButton />
    </section>
  );
}

/* Logo Letter Component */
function LogoLetter({ char, theme }) {
  return (
    <motion.span
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ scale: 1.2, textShadow: "0 0 20px rgba(201,163,74,0.9)" }}
      style={{
        borderColor: theme.logoBorder,
        backgroundImage: `linear-gradient(to bottom right, ${theme.logoGradientFrom}, ${theme.logoGradientTo})`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
      className="relative px-[8px] text-center font-extrabold border-2 rounded-lg transition-transform duration-500"
    >
      {char}
    </motion.span>
  );
}
