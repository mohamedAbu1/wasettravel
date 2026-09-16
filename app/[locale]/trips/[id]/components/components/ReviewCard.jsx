"use client";
import {
  FaStar,
  FaThumbsUp,
  FaThumbsDown,
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
  deleteReview,
  updateReview,
  user,
}) {
  const isOwner = user && String(user.id) === String(rev.users?.id);
  const isAdmin = user && user?.user_metadata?.role === "ADMIN";

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
      <div className="flex items-center gap-4 mb-3">
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

        <div className="flex flex-col">
          <span className="font-bold text-lg capitalize">{rev.name || "Traveler"}</span>
          <span className="text-xs text-[var(--muted)]">{rev.date || rev.time}</span>
        </div>
      </div>

      {/* التقييم */}
      <div className="flex items-center gap-1 mb-2">
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
        <p className="mb-5 whitespace-pre-wrap leading-7 text-[var(--foreground)]">{rev.comment}</p>
      )}

      {/* أزرار التحكم */}
      <div className="flex flex-wrap items-center gap-3 mt-2">
        {/* زر لايك */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => addLike(rev.id)}
          className="trip-review-control"
        >
          <FaThumbsUp /> {likes[rev.id]?.count || 0}
        </motion.button>

        {/* زر إزالة لايك */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => removeLike(rev.id)}
          className="trip-review-control"
        >
          <FaThumbsDown /> Unlike
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
