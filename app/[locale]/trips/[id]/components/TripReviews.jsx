"use client";
import { useState } from "react";
import { FaStar, FaThumbsDown, FaThumbsUp, FaUserCircle } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useReviews } from "@/context/ReviewsContext";
import { useAuth } from "@/context/AuthContext";
import EmojiPicker from "emoji-picker-react";
import EgyptianBackground from "@/components/trips/EgyptianBackground";
import { motion } from "framer-motion";

export default function TripReviews({ trip,lang }) {
  const { themeName } = useTheme();
  const { t } = useTranslation("tripsId");
  const { reviews, addReview, likes, addLike, removeLike } = useReviews();
  const { user } = useAuth();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const translations = {
    en: {
      title: "Reviews & Ratings",
      average: "Average",
      placeholder: "Write your review...",
      submit: "Submit Review",
    },
    de: {
      title: "Bewertungen",
      average: "Durchschnitt",
      placeholder: "Schreibe deine Bewertung...",
      submit: "Bewertung abschicken",
    },
    it: {
      title: "Recensioni e valutazioni",
      average: "Media",
      placeholder: "Scrivi la tua recensione...",
      submit: "Invia recensione",
    },
    es: {
      title: "Reseñas y calificaciones",
      average: "Promedio",
      placeholder: "Escribe tu reseña...",
      submit: "Enviar reseña",
    },
    zh: {
      title: "评论与评分",
      average: "平均",
      placeholder: "写下你的评论...",
      submit: "提交评论",
    },
    fr: {
      title: "Avis et notes",
      average: "Moyenne",
      placeholder: "Écrivez votre avis...",
      submit: "Soumettre l'avis",
    },
  };
  const tr = translations[lang] || translations.en;
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || rating === 0 || !user) return;

    const newReview = {
      trip_id: trip.id,
      user_id: user.id,
      rating,
      comment,
      name: user.name || user.email,
      avatar_url: user.avatar_url || null,
      time: new Date().toLocaleTimeString(),
    };

    await addReview(newReview);
    setComment("");
    setRating(0);
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  const onEmojiClick = (emojiData) => {
    setComment(comment + emojiData.emoji);
  };

  return (
    <section
      className={`p-6 rounded-xl shadow-lg transition ${
        themeName === "dark"
          ? "bg-black/40 text-gold"
          : "bg-white/90 text-[#3a2c0a]"
      }`}
    >
      <EgyptianBackground />

      {/* العنوان */}
      <div className="flex items-center justify-between mb-6 border-b pb-2">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          {tr.title}
        </h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="font-semibold"> {tr.average}</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  size={20}
                  className={
                    i < Math.round(averageRating)
                      ? themeName === "dark"
                        ? "text-yellow-400"
                        : "text-[#c9a34a]"
                      : "text-gray-400"
                  }
                />
              ))}
            </div>
            <span className="ml-2">({averageRating})</span>
          </div>
        )}
      </div>

      {/* تقييم النجوم */}
      <div className="flex gap-2 mb-4">
        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;
          return (
            <FaStar
              key={starValue}
              size={28}
              className={`cursor-pointer transition ${
                starValue <= (hover || rating)
                  ? themeName === "dark"
                    ? "text-yellow-400"
                    : "text-[#c9a34a]"
                  : "text-gray-400"
              }`}
              onClick={() => setRating(starValue)}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(0)}
            />
          );
        })}
      </div>

      {/* نموذج التعليق */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="w-[70%]flex items-center gap-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={tr.placeholder}
            className={`w-full p-3 rounded-lg border focus:outline-none ${
              themeName === "dark"
                ? "bg-black/60 border-gold/50 text-gold"
                : "bg-[#fdf6e3] border-[#c9a34a]/50 text-[#3a2c0a]"
            }`}
            rows={3}
          />

          {/* زر فتح الإيموجي */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            😀
          </button>
          {showEmojiPicker && <EmojiPicker onEmojiClick={onEmojiClick} />}
        </div>

        {/* إظهار الـ Emoji Picker */}

        <button
          type="submit"
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            themeName === "dark"
              ? "bg-gold text-black hover:bg-yellow-300"
              : "bg-[#c9a34a] text-white hover:bg-[#a67c00]"
          }`}
        >
         {tr.submit}
        </button>
      </form>

      {/* عرض التعليقات */}
      <div className="flex flex-row flex-wrap mt-6 gap-6 space-y-4">
        <EgyptianBackground />

        {[...reviews]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .map((rev, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`w-[48%] p-4 rounded-lg shadow-md ${
                themeName === "dark"
                  ? "bg-black/60 text-gold"
                  : "bg-[#fdf6e3] text-[#3a2c0a]"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                {rev.avatar_url ? (
                  <img
                    src={rev.avatar_url}
                    alt={rev.name}
                    className="w-25 h-25 rounded-full"
                  />
                ) : (
                  <FaUserCircle size={68} />
                )}
                <div className="flex flex-col gap-1">
                  <span
                    style={{ textTransform: "capitalize" }}
                    className="font-semibold"
                  >
                    {rev.name}
                  </span>
                  <div className="flex items-center justify-center gap-4">
                    {[...Array(rev.rating)].map((_, i) => (
                      <FaStar
                        key={i}
                        size={18}
                        className={
                          themeName === "dark"
                            ? "text-yellow-400"
                            : "text-[#c9a34a]"
                        }
                      />
                    ))}
                  </div>
                  <span
                    style={{
                      paddingTop: "1px",
                      fontWeight: "700",
                      fontSize: "14px",
                    }}
                    className="text-xs opacity-70"
                  >
                    {rev.date || rev.time}
                  </span>
                  <p className="italic">{rev.comment}</p>

                  {/* زر اللايك والديسلايك مع أنيميشن */}
                  <div className="flex items-center gap-3 mt-2">
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      onClick={() => addLike(rev.id)}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      <FaThumbsUp size={18} /> {likes[rev.id] || 0}
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      whileHover={{ scale: 1.2, rotate: -10 }}
                      onClick={() => removeLike(rev.id)}
                      className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
                    >
                      <FaThumbsDown size={18} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
      </div>
    </section>
  );
}
