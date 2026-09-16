"use client";
import { FaStar } from "react-icons/fa";

export default function StarRating({ rating, setRating, hover, setHover }) {
  return (
    <div className="flex gap-2" role="radiogroup" aria-label="Choose a rating">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button type="button" role="radio" aria-checked={rating === starValue} aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`} onClick={() => setRating(starValue)} onMouseEnter={() => setHover(starValue)} onMouseLeave={() => setHover(0)} className="rounded p-1 text-2xl transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--color)]">
          <FaStar
            key={starValue}
            size={28}
            className={starValue <= (hover || rating) ? "text-[var(--color)]" : "text-[var(--line)]"}
          />
          </button>
        );
      })}
    </div>
  );
}
