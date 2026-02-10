"use client";
import { useReviews } from "@/context/ReviewsContext";
import { useTheme } from "@/context/ThemeContext";
import { FaStar, FaUserCircle, FaQuoteLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import { useTranslation } from "react-i18next";

export default function TopReviewsSection() {
  const { allReviews, likes } = useReviews();
  const { theme } = useTheme();
  const { t } = useTranslation("home");

  // ✅ تأكد أن reviews مصفوفة حتى لو undefined
  const safeReviews = Array.isArray(allReviews) ? allReviews : [];

  // ✅ جلب أكثر 6 تعليقات لهم لايكات
  const topLikedReviews = safeReviews
    .map((rev) => ({
      ...rev,
      likesCount: likes[rev.id]?.count || 0,
    }))
    .filter((rev) => rev.likesCount > 0) // تجاهل التعليقات بدون لايكات
    .sort((a, b) => b.likesCount - a.likesCount)
    .slice(0, 6);

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
  };

  return (
    <section
      className={`py-20 px-8 ${theme.background} ${theme.text} w-screen max-w-full`}
    >
      <EgyptianBackground />
      <h2 className="text-5xl font-extrabold mb-14 text-center uppercase">
        {t("h6")}
      </h2>

      {topLikedReviews.length > 0 ? (
        <Slider {...settings}>
          {topLikedReviews.map((rev, idx) => (
            <motion.div
              key={rev.id || idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`flex flex-col gap-6 p-8 mx-4 ${theme.card} ${theme.shadow} rounded-2xl min-h-[220px]`}
            >
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
                  <h3
                    className={`font-bold text-lg ${theme.heading} capitalize`}
                  >
                    {rev.name || "Anonymous"}
                  </h3>
                  <div className="flex gap-1">
                    {[...Array(rev.rating || 0)].map((_, i) => (
                      <FaStar key={i} className={theme.icon} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="relative flex-1 mt-6">
                <FaQuoteLeft className="absolute top-0 left-0 text-3xl opacity-20" />
                <p
                  className={`italic leading-relaxed text-base pl-10 ${theme.subText}`}
                  style={{ textAlign: "justify" }}
                >
                  {rev.comment}
                </p>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center mt-6 border-t pt-4">
                {/* التاريخ */}
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{rev.date || rev.time || "Unknown date"}</span>
                </div>

                {/* اللايكات */}
                <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm bg-blue-50 px-3 py-1 rounded-full shadow-sm">
                  <span>{rev.likesCount}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 10a6 6 0 1112 0 6 6 0 01-12 0zm6-4a1 1 0 00-1 1v2H5a1 1 0 000 2h2v2a1 1 0 002 0v-2h2a1 1 0 000-2H9V7a1 1 0 00-1-1z" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </Slider>
      ) : (
        <p className={`text-center opacity-70 ${theme.subText}`}>{t("p6")}</p>
      )}
    </section>
  );
}
