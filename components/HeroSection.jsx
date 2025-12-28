"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
// FontAwesome
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

// WhatsApp (من FontAwesome)
import { FaWhatsapp } from "react-icons/fa";

// Gmail مش موجود كأيقونة رسمية في FontAwesome
// ممكن تستخدم أيقونة البريد من Material Design Icons
import { MdEmail } from "react-icons/md";
import { useTheme } from "@/context/ThemeContext";
import Content from "./Content";
import DownloadAppSection from "./DownloadAppSection";
import { FaGooglePlay, FaApple } from "react-icons/fa";

export default function HeroSection() {
  const { themeName, theme } = useTheme();

  const images = [
    "/HomePageImage/pexels-axp-photography-500641970-18934598.webp",
    "/HomePageImage/pexels-diego-f-parra-33199-15131539.webp",
    "/HomePageImage/pexels-axp-photography-500641970-18991537.webp",
    "/HomePageImage/pexels-axp-photography-500641970-18934596.webp",
    "/HomePageImage/pexels-frans-van-heerden-201846-631339.webp",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className={`
        relative h-[100vh] w-full overflow-hidden
        ${theme.background} ${theme.text}
        transition-colors duration-300
      `}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          key={index}
          src={images[index]}
          alt="WasetTravel Slide"
          fill
          priority
          className="object-cover opacity-90 transition-opacity duration-1000"
        />
      </div>

      {/* Overlay */}
      <div className={`absolute inset-0 ${theme.overlay}`} />

      {/* Floating Halo Light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/10 blur-[120px] rounded-full animate-pulse" />

      {/* Social Media */}
      <div className=" hidden absolute right-10 top-1/2 -translate-y-1/2 md:flex flex-col gap-6 z-30">
        {[
          {
            Icon: FaGooglePlay,
            link: "https://play.google.com/store/games?device=windows&pli=1",
          },
          { Icon: FaApple, link: "https://locate.apple.com/eg/en/" },
        ].map(({ Icon, link }, i) => (
          <a
            key={i}
            href={link}
            target="_blank"
            className={`
              p-3 rounded-full
              ${theme.card} ${theme.shadow}
              hover:scale-125 transition-all
            `}
          >
            <Icon size={22} className={theme.icon} />
          </a>
        ))}
      </div>
      <div className="absolute left-10 top-220 md:top-1/2 -translate-y-1/2 flex flex-row md:flex-col gap-6 z-30">
        {[
          {
            Icon: FaFacebookF,
            link: "https://www.facebook.com/mohamed.abu.102566",
          },
          { Icon: FaInstagram, link: "https://www.instagram.com/YourProfile" },
          { Icon: FaTiktok, link: "https://www.tiktok.com/@YourProfile" },
          { Icon: FaWhatsapp, link: "https://wa.me/201234567890" }, // رقم واتساب بصيغة دولية
          {
            Icon: MdEmail,
            link: "https://mail.google.com/mail/u/0/?hl=en#inbox",
          }, // يفتح Gmail مباشرة
        ].map(({ Icon, link }, i) => (
          <a
            key={i}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={`
        p-3 rounded-full
        ${theme.card} ${theme.shadow}
        hover:scale-125 transition-all
      `}
          >
            <Icon size={22} className={theme.icon} />
          </a>
        ))}
      </div>

      {/* Content + Logo في منتصف الشاشة */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full gap-4">
        {/* Content (شريط الإنبتوتات) */}
        <Content />
        <DownloadAppSection />

        {/* WASET TOURS Logo */}
        <div
          style={{ backgroundColor: "rgba(0,0,0,0.5)", borderRadius: "7px" }}
          className={`

            flex flex-wrap gap-4 justify-center 
            font-[Cinzel] text-[28px] sm:text-[36px] md:text-[48px] lg:text-[64px] 
            tracking-[0.05em] sm:tracking-[0.1em] md:tracking-[0.15em] lg:tracking-[0.2em]
            animate-fadeInUp
          `}
        >
          {["W", "A", "S", "E", "T"].map((char, i) => (
            <LogoLetter key={i} char={char} theme={theme} />
          ))}

          {/* رمز الشركة الفرعوني */}
          <span
            style={{
              color: theme.logoBorder,
              textShadow: "0 0 16px rgba(201,163,74,0.7)",
            }}
            className="text-[24px] sm:text-[32px] md:text-[44px] lg:text-[50px] mx-3 animate-pulse"
          >
            𓂀
          </span>

          {["T", "O", "U", "R", "S"].map((char, i) => (
            <LogoLetter key={i + 5} char={char} theme={theme} />
          ))}
        </div>
      </div>

      {/* Bottom Fade */}
      {/* <div
        className={`absolute bottom-0 left-0 w-full h-40 ${theme.overlay}`}
      /> */}
    </section>
  );
}

/* Component for each letter */
function LogoLetter({ char, theme }) {
  return (
    <span
      style={{
        borderColor: theme.logoBorder,
        backgroundImage: `linear-gradient(to bottom right, ${theme.logoGradientFrom}, ${theme.logoGradientTo})`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        textShadow: "0 0 12px rgba(201,163,74,0.6)",
      }}
      className={`
        
        relative px-[8px] text-center font-extrabold border-2 rounded-lg
        transition-transform duration-500 hover:scale-110
      `}
    >
      {char}
      <span
        style={{ color: theme.logoBorder }}
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[20px] sm:text-[24px] md:text-[26px] opacity-70"
      >
        𓂀
      </span>
    </span>
  );
}
