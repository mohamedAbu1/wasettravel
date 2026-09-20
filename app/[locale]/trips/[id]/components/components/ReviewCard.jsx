"use client";
import {
  FaStar,
  FaThumbsUp,
  FaUserCircle,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ReviewCard({
  rev,
  idx,
  themeName,
  likes,
  addLike,
  removeLike,
  isLiked,
  likePending,
  deleteReview,
  updateReview,
  user,
}) {
  const isOwner = user && String(user.id) === String(rev.user_id || rev.users?.id);
  const isAdmin = user && String(user?.role || user?.user_metadata?.role || "").trim().toLowerCase() === "admin";
  const reviewIsLiked = Boolean(user && isLiked?.(rev.id, user.id));
  const isLikePending = Boolean(likePending?.[rev.id]);

  // 🆕 حالات التعديل
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(rev.comment);
  const [editedRating, setEditedRating] = useState(rev.rating);

  const handleSave = () => {
    updateReview(rev.id, {
      comment: editedComment,
      rating: editedRating,
    });
    setIsEditing(false);
  };

  return (
    <motion.div
      key={idx}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: idx * 0.1 }}
      className="trip-review-card"
    >
      {/* رأس البطاقة */}
      <div className="trip-review-card__header">
        {rev.picture || rev.avatar_url || rev.avatar ? (
          <img
            src={
              rev.picture ||
              rev.avatar_url ||
              rev.avatar ||
              "/default-avatar.png"
            }
            alt={rev.name}
            className="h-12 w-12 rounded-full border-2 border-[var(--color)] object-cover"
          />
        ) : (
          <FaUserCircle size={48} className="text-[var(--muted)]" />
        )}

        <div className="trip-review-card__identity">
          <span className="trip-review-card__name">{rev.name || "Traveler"}</span>
          <span className="trip-review-card__date">{rev.date || rev.time}</span>
        </div>
      </div>

      {/* التقييم */}
      <div className="trip-review-card__rating" aria-label={`${rev.rating || 0} out of 5 stars`}>
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            size={20}
            className={
              i < Number(rev.rating) ? "text-[var(--color)]" : "text-[var(--line)]"
            }
          />
        ))}
      </div>

      {/* التعليق أو وضع التعديل */}
      {isEditing ? (
        <div className="space-y-2 mb-4">
          <textarea
            value={editedComment}
            onChange={(e) => setEditedComment(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            min="1"
            max="5"
            value={editedRating}
            onChange={(e) => setEditedRating(Number(e.target.value))}
            className="w-16 p-1 border rounded"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-green-500 text-white rounded"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="trip-review-card__comment">{rev.comment}</p>
      )}

      {/* أزرار التحكم */}
      <div className="trip-review-card__actions">
        {/* زر الإعجاب الموحد */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => (reviewIsLiked ? removeLike(rev.id) : addLike(rev.id))}
          disabled={!user || isLikePending}
          aria-pressed={reviewIsLiked}
          aria-label={reviewIsLiked ? "Remove your like" : "Like this review"}
          className={`trip-review-control ${reviewIsLiked ? "trip-review-control--liked" : ""} ${!user || isLikePending ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <FaThumbsUp /> {reviewIsLiked ? "Liked" : "Like"} <strong>{likes[rev.id]?.count || 0}</strong>
        </motion.button>

        {/* صلاحيات الأدمن */}
        {isAdmin && !isOwner && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => deleteReview(rev.id)}
            className="trip-review-control trip-review-control--danger"
          >
            <FaTrash /> Delete
          </motion.button>
        )}

        {/* صلاحيات المالك */}
        {isOwner && (
          <>
            {!isEditing && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                onClick={() => setIsEditing(true)}
                className="trip-review-control trip-review-control--success"
              >
                <FaEdit /> Edit
              </motion.button>
            )}

            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              onClick={() => deleteReview(rev.id)}
              style={{ cursor: "pointer" }}
              className="trip-review-control trip-review-control--danger"
            >
              <FaTrash /> Delete
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );
}
