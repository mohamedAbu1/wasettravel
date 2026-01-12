/* eslint-disable react-hooks/purity */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";

const OurSection = () => {
  const router = useRouter();
  const { theme, themeName } = useTheme();
  const { t } = useTranslation("home");

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  const symbols = [
    "𓂀",
    "𓋹",
    "𓆣",
    "𓇼",
    "𓇯",
    "𓏏",
    "𓎛",
    "𓊽",
    "𓃾",
    "𓅓",
    "𓈇",
    "𓉐",
    "𓊹",
    "𓌙",
    "𓍿",
    "𓎟",
  ];

  return (
    <section
      id="section-four"
      style={{ paddingBottom: "40px", paddingTop: "20px" }}
      className={` hidden lg:flex relative w-full min-h-screen px-4 sm:py-10 md:py-12 lg:py-0 flex-col items-center justify-start ${theme.background} ${theme.text}`}
    >
      {/* خلفية الرموز الفرعونية */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        {Array.from({ length: 25 }).map((_, i) => (
          <span
            key={i}
            className={`absolute ${
              themeName === "dark" ? "text-gray-700" : "text-[#c9a34a]"
            } opacity-30 text-7xl animate-pulse`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          >
            {symbols[Math.floor(Math.random() * symbols.length)]}
          </span>
        ))}
      </div>

      <div className="w-full max-w-screen-xl flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
        {/* ✅ Slider with animation */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full lg:w-1/2 rounded-3xl overflow-hidden shadow-xl"
          style={{
            boxShadow:
              themeName === "dark"
                ? "0 6px 20px rgba(201,163,74,0.4)"
                : "0 6px 20px rgba(58,44,10,0.2)",
          }}
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            spaceBetween={30}
            slidesPerView={1}
            className="w-full h-full"
          >
            {[
              "/HomePageImage/pexels-furknsaglam-1596977-21348185.webp",
              "/HomePageImage/pexels-oualid-soussi-2150533856-35050672.webp",
              "/HomePageImage/pexels-ozgomz-7566890.webp",
              "/HomePageImage/pexels-radwa-magdy-1718930-21668633.webp",
              "/HomePageImage/pexels-yasmine-qasem-1054896-2034684.webp",
            ].map((imgSrc, index) => (
              <SwiperSlide key={index}>
                <div className="w-full h-[85vh]">
                  <Image
                    src={imgSrc}
                    fill
                    alt={`WasetTravel Slide ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* ✅ Text with animation */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full lg:w-1/2 text-start gap-9"
          style={{ paddingLeft: "13px" }}
        >
          <p
            className="text-sm uppercase mb-2 tracking-wide"
            style={{
              color: themeName === "dark" ? "#aaa" : "#6b4f1d",
            }}
          >
           {t("AboutUs")} 
          </p>

          <h2
            className="text-3xl lg:text-4xl font-bold mb-4 leading-snug"
            style={{
              color: themeName === "dark" ? "#fff" : "#3a2c0a",
            }}
          >
           {t("DiscoverWasetTravel")}  
          </h2>

          <p
            className="text-base mb-6 leading-relaxed"
            style={{
              color: themeName === "dark" ? "#ccc" : "#5c4520",
            }}
          >
           {t("At")}{" "}
            <span
              style={{
                color: "#c9a34a",
                fontWeight: 600,
              }}
            >
              WasetTravel
            </span>
            {t("AtP")}{" "}
            <span
              style={{
                color: "#c9a34a",
                fontWeight: 600,
              }}
            >
             {t("professionalguides")} 
            </span>{" "}
           {t("AtPP")} 
          </p>

          <button
            onClick={() => router.push("/about")}
            style={{cursor:"pointer"}}
            className={`hover:scale-105 px-6 py-3 rounded-lg font-semibold transition shadow-lg ${
              themeName === "dark"
                ? "bg-amber-400 text-black hover:bg-yellow-500"
                : "bg-[#c9a34a] text-white hover:bg-[#b5892e]"
            }`}
          >
           {t("LearnMoreAboutUs")}
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default OurSection;
