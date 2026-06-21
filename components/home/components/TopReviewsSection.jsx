"use client";
import { useReviews } from "@/context/ReviewsContext";
import { useTheme } from "@/context/ThemeContext";
import { FaStar, FaUserCircle, FaQuoteLeft, FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { useState } from "react";

export default function TopReviewsSection() {
  const { allReviews, likes } = useReviews();
  const { theme } = useTheme();
  const { t } = useTranslation("home");

  const safeReviews = Array.isArray(allReviews) ? allReviews : [];

  const topLikedReviews = safeReviews
    .map((rev) => ({
      ...rev,
      likesCount: likes[rev.id]?.count || 0,
    }))
    .filter((rev) => rev.likesCount > 0)
    .sort((a, b) => b.likesCount - a.likesCount)
    .slice(0, 5);

  const [expandedIds, setExpandedIds] = useState([]);
  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <section
      className={`py-20 px-4 md:px-8 ${theme.background} ${theme.text} w-full mx-auto`}
    >
      <EgyptianBackground />
      <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold mb-10 text-center uppercase">
        {t("h6")}
      </h2>

      {topLikedReviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topLikedReviews.map((rev, idx) => {
            const expanded = expandedIds.includes(rev.id);
            const comment =
              rev.comment?.length > 150 && !expanded
                ? rev.comment.slice(0, 150) + "..."
                : rev.comment;

            return (
              <motion.div
                key={rev.id || idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex flex-col gap-6 p-6 md:p-8 rounded-2xl min-h-[220px]"
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                }}
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
                    {comment}
                  </p>
                  {rev.comment?.length > 150 && (
                    <button
                      onClick={() => toggleExpand(rev.id)}
                      className="text-sm text-blue-500 mt-2"
                    >
                      {expanded ? "إخفاء" : "اقرأ المزيد"}
                    </button>
                  )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center mt-6 border-t pt-4">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <span>
                      {rev.created_at
                        ? format(new Date(rev.created_at), "dd MMM yyyy")
                        : "Unknown date"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-red-600 font-semibold text-sm bg-red-50 px-3 py-1 rounded-full shadow-sm">
                    <FaHeart />
                    <span>{rev.likesCount}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <p className={`text-center opacity-70 ${theme.subText}`}>{t("p6")}</p>
      )}
    </section>
  );
}
