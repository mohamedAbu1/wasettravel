"use client";
import { FaStar, FaRegCommentDots } from "react-icons/fa";

export default function ReviewsHeader({ title, averageRating, reviewsCount }) {
  return (
    <div className="trip-reviews__header">
      <div><p className="stone-kicker mb-2 flex items-center gap-2"><FaRegCommentDots /> Guest perspective</p><h2 className="font-display text-2xl font-bold sm:text-3xl">{title}</h2><p className="mt-2 text-sm text-[var(--muted)]">Real feedback from travelers who explored Egypt with us.</p></div>
      <div className="trip-reviews__score" aria-label={`${averageRating} out of 5 from ${reviewsCount} reviews`}><strong>{reviewsCount ? averageRating : "—"}</strong><div className="flex gap-1" aria-hidden="true">{[...Array(5)].map((_, i) => <FaStar key={i} className={i < Math.round(Number(averageRating)) ? "text-[var(--color)]" : "text-[var(--line)]"} />)}</div><span>{reviewsCount} {reviewsCount === 1 ? "review" : "reviews"}</span></div>
    </div>
  );
}
