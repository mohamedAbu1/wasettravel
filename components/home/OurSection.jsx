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
import DividerWithIcon from "../layout/DividerWithIcon";

const OurSection = () => {
  const router = useRouter();
  const { theme, themeName } = useTheme();
  const { t } = useTranslation("home");

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) return null;

  const images = [
    "/Aswan/pexels-furknsaglam-1596977-21348185.webp",
    "/Luxor/pexels-oualid-soussi-2150533856-35050672.webp",
    "/Cairo/pexels-ozgomz-7566890.webp",
    "/HomePageImage/pexels-radwa-magdy-1718930-21668633.webp",
    "/Luxor/pexels-yasmine-qasem-1054896-2034684.webp",
  ];

  return (
    <>
      {/* ✅ نسخة الشاشات الكبيرة */}
      <section
        id="section-four"
        className={`hidden lg:flex relative w-full min-h-screen px-4 py-12 flex-col items-center justify-start ${theme.background} ${theme.text}`}
      >
        <div className="w-full max-w-screen-xl flex flex-row items-center justify-between gap-10 relative z-10">
          {/* Slider */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-1/2 rounded-3xl overflow-hidden shadow-xl"
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
              {images.map((imgSrc, index) => (
                <SwiperSlide key={index}>
                  <div className="w-full h-[85vh]">
                    <Image
                      src={imgSrc}
                        alt={`Slide ${index + 1} showing Waset Travel destination`} // ✅ وصف أوضح
                      fill
                      className="object-cover rounded-lg"
                      loading="lazy"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-1/2 text-start"
          >
            <p className="text-sm uppercase mb-2 tracking-wide">
              {t("AboutUs")}
            </p>
            <h2 className="text-4xl font-bold mb-4">{t("DiscoverWasetTravel")}</h2>
            <DividerWithIcon />
            <p className="text-base mb-6 leading-relaxed">
              {t("At")} <span className="text-[#c9a34a] font-semibold">WasetTravel</span> {t("AtP")}{" "}
              <span className="text-[#c9a34a] font-semibold">{t("professionalguides")}</span> {t("AtPP")}
            </p>
     <button
  onClick={() => router.push("/about")}
  aria-label="Learn more about Waset Travel" // ✅ اسم واضح
  className="px-6 py-3 rounded-lg font-semibold transition shadow-lg bg-[#c9a34a] text-white hover:bg-[#b5892e]"
>
  {t("LearnMoreAboutUs")}
</button>

          </motion.div>

           <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-1/2 rounded-3xl overflow-hidden shadow-xl"
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
              {images.map((imgSrc, index) => (
                <SwiperSlide key={index}>
                  <div className="w-full h-[85vh]">
                    <Image
                      src={imgSrc}
                      alt={`WasetTravel Slide ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                      loading="lazy"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </div>
      </section>

      {/* ✅ نسخة الموبايل */}
      <section
        className={`flex lg:hidden flex-col w-full px-4 py-12 items-center justify-start ${theme.background} ${theme.text}`}
      >
        {/* Slider full width */}
        <div className="w-full rounded-2xl overflow-hidden shadow-lg mb-8">
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            spaceBetween={20}
            slidesPerView={1}
            className="w-full h-[300px] sm:h-[400px]"
          >
            {images.map((imgSrc, index) => (
              <SwiperSlide key={index}>
                <div className="w-full h-full">
                  <Image
                    src={imgSrc}
                    alt={`WasetTravel Slide ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                    loading="lazy"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Text under slider */}
        <div className="text-center max-w-md">
          <p className="text-xs uppercase mb-2 tracking-wide">{t("AboutUs")}</p>
          <h2
  role="heading"
  aria-level={2}
  aria-label={t("DiscoverWasetTravel")}
  className="text-4xl font-bold mb-4"
>
  {t("DiscoverWasetTravel")}
</h2>

          <DividerWithIcon />
         <p
  aria-label="About Waset Travel description"
  className="text-base mb-6 leading-relaxed"
>
  {t("At")} <span className="text-[#c9a34a] font-semibold">WasetTravel</span> {t("AtP")}{" "}
  <span className="text-[#c9a34a] font-semibold">{t("professionalguides")}</span> {t("AtPP")}
</p>

          <button
            onClick={() => router.push("/about")}
            className="px-5 py-2 rounded-lg font-medium transition shadow-md bg-[#c9a34a] text-white hover:bg-[#b5892e]"
          >
            {t("LearnMoreAboutUs")}
          </button>
        </div>
      </section>
    </>
  );
};

export default OurSection;
