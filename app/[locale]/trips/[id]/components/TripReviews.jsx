"use client";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useReviews } from "@/context/ReviewsContext";
import { useAuth } from "@/context/AuthContext";
import ReviewsHeader from "./components/ReviewsHeader";
import StarRating from "./components/StarRating";
import ReviewForm from "./components/ReviewForm";
import ReviewCard from "./components/ReviewCard";
import { useSearchParams } from "next/navigation";

export default function TripReviews({ trip, lang }) {
  const { themeName } = useTheme();
  const {
    reviewsByTrip,
    addReview,
    deleteReview,
    updateReview,
    likes,
    addLike,
    fetchReviewsByTrip,
    removeLike,
    isLiked,
    likePending,
  } = useReviews();
  const { userData } = useAuth();
  const { t } = useTranslation("tripsId");
  const { t: ui } = useTranslation("ui");

  // ✅ استدعاء التعليقات الخاصة بالرحلة عند تحميل الكومبوننت
  useEffect(() => {
    const loadReviews = async () => {
      if (trip?.id) {
        await fetchReviewsByTrip(trip.id);
      }
    };
    loadReviews();
  }, [trip?.id]);

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
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // ✅ الباجينيشن
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 4;

  // ✅ التعليقات الخاصة بالرحلة الحالية فقط
  const tripReviews = reviewsByTrip[trip.id] || [];

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = [...tripReviews]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(indexOfFirstComment, indexOfLastComment);

  const totalPages = Math.ceil(tripReviews.length / commentsPerPage);

  useEffect(() => {
    setCurrentPage((page) => Math.max(1, Math.min(page, Math.max(totalPages, 1))));
  }, [totalPages]);

  // ✅ دالة إضافة تعليق
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || rating === 0 || !userData || isSubmitting) {
      if (!userData) setSubmitError("Please log in before submitting a review.");
      else if (!comment.trim() || rating === 0) setSubmitError("Please add a comment and choose a rating.");
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);
    try {
      const result = await addReview({
        trip_id: trip.id,
        rating,
        comment,
        name: userData?.name || userData.email,
        avatar_url: userData?.avatar_url || userData?.image,
        time: new Date().toLocaleTimeString(),
      });
      if (!result?.success) {
        setSubmitError(result?.error || "The review could not be submitted. Please try again.");
        return;
      }
      setComment("");
      setRating(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating =
    tripReviews.length > 0
      ? (
          tripReviews.reduce((acc, r) => acc + r.rating, 0) / tripReviews.length
        ).toFixed(1)
      : 0;

  const onEmojiClick = (emojiData) => {
    setComment(comment + emojiData.emoji);
  };

  // ✅ قراءة باراميتر highlightReview من الـ URL
  const searchParams = useSearchParams();
  const highlightReviewId = searchParams.get("highlightReview");
  const [highlighted, setHighlighted] = useState(null);

  useEffect(() => {
    if (highlightReviewId) {
      setHighlighted(highlightReviewId);

      // ✅ Scroll إلى التعليق الجديد
      const element = document.getElementById(`review-${highlightReviewId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      // ✅ إزالة التمييز بعد 4 ثواني
      const timer = setTimeout(() => setHighlighted(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [highlightReviewId]);

  return (
    <section className="trip-detail-panel trip-reviews-section p-5 sm:p-7">

      {/* العنوان + المتوسط */}
      <ReviewsHeader
        title={tr.title}
        averageRating={averageRating}
        reviewsCount={tripReviews.length}
      />

      {userData && (
        <div className="trip-review-composer mt-6">
          <div className="mb-4"><p className="font-semibold">{ui("shareExperience")}</p><p className="text-sm text-[var(--muted)]">{ui("reviewPrompt")}</p></div>
          {/* تقييم النجوم */}
          <StarRating
            rating={rating}
            setRating={setRating}
            hover={hover}
            setHover={setHover}
          />

          {/* نموذج إضافة تعليق */}
          <ReviewForm
            comment={comment}
            setComment={setComment}
            showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker}
            onEmojiClick={onEmojiClick}
            onSubmit={handleSubmit}
            placeholder={tr.placeholder}
            submitLabel={tr.submit}
            themeName={themeName}
            disabled={isSubmitting}
          />
          {submitError ? <p role="alert" className="mt-3 rounded-xl border border-[#a34e42]/30 bg-[#a34e42]/10 px-4 py-3 text-sm font-semibold text-[#a34e42]">{submitError}</p> : null}
        </div>
      )}

      {/* عرض التعليقات */}
      <div className="mt-7 grid gap-4 md:grid-cols-2">
        {currentComments.map((rev, idx) => (
          <div
            key={rev.id || idx}
            id={`review-${rev.id}`}
            className={`transition ${highlighted === rev.id ? "rounded-2xl ring-2 ring-[var(--color)] ring-offset-2 ring-offset-[var(--surface)]" : ""}`}
          >
            <ReviewCard
              rev={rev}
              idx={idx}
              user={userData}
              deleteReview={deleteReview}
              updateReview={updateReview}
              themeName={themeName}
              likes={likes}
              addLike={addLike}
              removeLike={removeLike}
              isLiked={isLiked}
              likePending={likePending}
            />
          </div>
        ))}

        {tripReviews.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-[var(--line)] p-8 text-center text-[var(--muted)]">
            {!userData
              ? "Please log in to write your review"
              : "Be the first to review this trip ✨"}
          </div>
        )}
      </div>

      {/* الباجينيشن */}
      {totalPages > 1 && (
        <div className="mt-7 flex justify-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            aria-label={ui("previousReviews")}
            className={`trip-detail-pagination ${
              currentPage === 1
                ? "opacity-40 cursor-not-allowed"
                : ""
            }`}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              aria-label={`Go to review page ${i + 1}`}
              className={`trip-detail-pagination ${
                currentPage === i + 1
                  ? "trip-detail-pagination--active"
                  : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            aria-label={ui("nextReviews")}
            className={`trip-detail-pagination ${
              currentPage === totalPages
                ? "opacity-40 cursor-not-allowed"
                : ""
            }`}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
