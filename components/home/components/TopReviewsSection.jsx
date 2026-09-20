"use client";
import { useReviews } from "@/context/ReviewsContext";
import { useTheme } from "@/context/ThemeContext";
import { FaArrowRight, FaCheckCircle, FaHeart, FaQuoteLeft, FaStar, FaUserCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import DividerWithIcon from "@/components/layout/DividerWithIcon";

export default function TopReviewsSection() {
  const { allReviews, likes } = useReviews();
  const { theme } = useTheme();
  const { t } = useTranslation("home");

  const safeReviews = Array.isArray(allReviews) ? allReviews : [];
  const [expandedIds, setExpandedIds] = useState([]);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!safeReviews.length) return null;

  // ✅ حساب التعليقات الأكثر إعجابًا
  const topLikedReviews = safeReviews
    .map((rev) => ({
      ...rev,
      likesCount: likes[rev.id]?.count || 0,
    }))
    .filter((rev) => rev.likesCount > 0)
    .sort((a, b) => b.likesCount - a.likesCount)
    .slice(0, 5);

  // ✅ لو ما فيش تعليقات عليها إعجابات → نعرض آخر 6 تعليقات
  const fallbackReviews =
    topLikedReviews.length > 0
      ? topLikedReviews
      : safeReviews
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          )
          .slice(0, 6);

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

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
      { breakpoint: 1440, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section
      className={`home-reviews-section stone-section py-20 px-4 md:px-8 ${theme.background} ${theme.text} w-screen max-w-full flex flex-col items-center justify-center`}
    >
      <EgyptianBackground />
      <h2
        role="heading"
        aria-level={2}
        aria-label={t("h6")}
        className="sc-title-first text-[21px] md:text-5xl font-extrabold tracking-wide drop-shadow-md text-left text-gradient"
      >
        <span className="inline-block transform scale-x-[-1] mr-4">𓅓</span>
        {t("h6")}
        <span className="inline-block ml-4">𓅓</span>
      </h2>

      <DividerWithIcon />

      {fallbackReviews.length > 0 ? (
        isLargeScreen ? (
          // ✅ عرض Slider في الشاشات الكبيرة
          <div className="max-w-7xl mx-auto">
            <Slider {...settings} className="w-full flex gap-2">
              {fallbackReviews.map((rev, idx) => renderCard(rev, idx))}
            </Slider>
          </div>
        ) : (
          // ✅ عرض Grid في الشاشات الصغيرة
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            {fallbackReviews.map((rev, idx) => renderCard(rev, idx))}
          </div>
        )
      ) : null}
    </section>
  );

  // ✅ دالة لإعادة استخدام الكارت
  function renderCard(rev, idx) {
    const expanded = expandedIds.includes(rev.id);
    const comment =
      rev.comment?.length > 150 && !expanded
        ? rev.comment.slice(0, 150) + "..."
        : rev.comment;

    return (
      <motion.div
        key={rev.id || idx}
        role="group"
        aria-label={`Review card by ${rev.name || "Anonymous"} with ${rev.likesCount} likes`}
        tabIndex={0}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="home-review-card"
      >
        <div className="home-review-card__glow" aria-hidden="true" />
        <div className="home-review-card__topline">
          <span className="home-review-card__eyebrow"><FaCheckCircle /> Verified traveler</span>
          <span className="home-review-card__index">0{idx + 1}</span>
        </div>

        <div className="home-review-card__profile">
          <div className="home-review-card__avatar-wrap">
            {rev.avatar_url ? <img src={rev.avatar_url} alt={`Avatar of ${rev.name || "Anonymous user"}`} width="64" height="64" loading="lazy" decoding="async" className="home-review-card__avatar" /> : <FaUserCircle className="home-review-card__avatar-fallback" aria-hidden="true" />}
            <span className="home-review-card__online" aria-hidden="true" />
          </div>
          <div className="home-review-card__identity">
            <h3>{rev.name || "Anonymous traveler"}</h3>
            <time dateTime={rev.created_at}>{rev.created_at ? format(new Date(rev.created_at), "dd MMM yyyy") : "Recent journey"}</time>
          </div>
          <div className="home-review-card__rating" aria-label={`${rev.rating || 0} out of 5 stars`}>
            <strong>{Number(rev.rating || 0).toFixed(1)}</strong>
            <span>{[...Array(Math.max(0, Math.min(5, Number(rev.rating) || 0)))].map((_, i) => <FaStar key={i} />)}</span>
          </div>
        </div>

        <div className="home-review-card__body">
          <FaQuoteLeft className="home-review-card__quote-mark" aria-hidden="true" />
          <p>{comment}</p>
          {rev.comment?.length > 150 ? <motion.button whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }} onClick={() => toggleExpand(rev.id)} aria-label={expanded ? "Hide full review" : "Read full review"} className="home-review-card__read-more">{expanded ? "Show less" : "Read full review"}<FaArrowRight /></motion.button> : null}
        </div>

        <div className="home-review-card__footer">
          <span className="home-review-card__footer-label">A story worth sharing</span>
          <span className="home-review-card__likes" aria-label={`${rev.likesCount} likes`}><FaHeart /> {rev.likesCount}</span>
        </div>
      </motion.div>
    );
  }
}
