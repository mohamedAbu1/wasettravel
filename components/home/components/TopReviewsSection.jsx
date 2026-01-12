"use client";
import { useReviews } from "@/context/ReviewsContext";
import { useTheme } from "@/context/ThemeContext";
import { FaStar, FaUserCircle, FaQuoteLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import EgyptianBackground from "@/components/trips/EgyptianBackground";
import { useTranslation } from "react-i18next";

export default function TopReviewsSection() {
  const { reviews } = useReviews();
  const { theme } = useTheme();

  const topReviews = reviews.filter((rev) => rev.rating === 5).slice(0, 10);
  const { i18n, t } = useTranslation("home");

  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
    appendDots: dots => (
      <div style={{ marginTop: "20px" }}>
        <ul style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          {dots}
        </ul>
      </div>
    ),
    customPaging: () => (
      <div
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          marginTop:"15px",
          background: theme.logoGradientTo,
        }}
      />
    ),
  };

  return (
    <section className={`py-20 px-8 ${theme.background} ${theme.text}`}>
      {/* Section Title */}
                      <EgyptianBackground />

      <h2
        className="text-5xl font-extrabold mb-14 text-center tracking-wide uppercase"
        style={{
      
        }}
      >
       {t("h6")}  
      </h2>

      {topReviews.length > 0 ? (
        <Slider {...settings}>
          {topReviews.map((rev, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`flex flex-col justify-between gap-6 p-8 mx-4 ${theme.card} ${theme.shadow} rounded-2xl min-h-[180px]`}
            >
                <EgyptianBackground />
              {/* Header */}
              <div className="flex items-center gap-4 border-b pb-3">
                {rev.avatar_url ? (
                  <img
                    src={rev.avatar_url}
                    alt={rev.name}
                    className="w-16 h-16 rounded-full border-2 object-cover"
                    style={{ borderColor: theme.logoBorder }}
                  />
                ) : (
                  <FaUserCircle size={64} className={theme.icon} />
                )}
                <div>
                  <h3 className={`font-bold text-lg ${theme.heading}`}>{rev.name}</h3>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={theme.icon} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="relative flex-1 mt-8">
                <FaQuoteLeft className="absolute top-0 left-0 text-3xl opacity-20" />
                <p
                  className={`italic leading-relaxed text-base pl-10 ${theme.subText}`}
                  style={{ textAlign: "justify" }}
                >
                  {rev.comment}
                </p>
              </div>

              {/* Footer */}
              <div className="flex justify-end">
                <span className="text-sm opacity-70">{rev.date || rev.time}</span>
              </div>
            </motion.div>
          ))}
        </Slider>
      ) : (
        <p className={`text-center opacity-70 ${theme.subText}`}>
         {t("p6")} 
        </p>
      )}
    </section>
  );
}
