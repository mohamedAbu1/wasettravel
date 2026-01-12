"use client";
import { FaStar, FaThumbsUp, FaThumbsDown, FaUserCircle } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ReviewCard({ rev, idx, themeName, likes, addLike, removeLike }) {
  return (
    <motion.div
      key={idx}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: idx * 0.1 }}
      className={`w-[48%] p-4 rounded-lg shadow-md ${
        themeName === "dark" ? "bg-black/60 text-gold" : "bg-[#fdf6e3] text-[#3a2c0a]"
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        {rev.avatar_url ? (
          <img src={rev.avatar_url} alt={rev.name} className="w-25 h-25 rounded-full" />
        ) : (
          <FaUserCircle size={68} />
        )}
        <div className="flex flex-col gap-1">
          <span className="font-semibold" style={{ textTransform: "capitalize" }}>
            {rev.name}
          </span>
          <div className="flex items-center gap-2">
            {[...Array(rev.rating)].map((_, i) => (
              <FaStar
                key={i}
                size={18}
                className={themeName === "dark" ? "text-yellow-400" : "text-[#c9a34a]"}
              />
            ))}
          </div>
          <span className="text-xs opacity-70 font-bold">{rev.date || rev.time}</span>
          <p className="italic">{rev.comment}</p>

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
  );
}
