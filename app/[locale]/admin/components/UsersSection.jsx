"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaSyncAlt,
  FaHeart,
  FaCommentDots,
  FaStar,
} from "react-icons/fa";
import { useUsers } from "../context/UserContext";
import { useTheme } from "@/context/ThemeContext";

const UsersSection = () => {
  const { users, fetchUsers } = useUsers();
  const { theme } = useTheme();
  const [activeUser, setActiveUser] = useState(null);
  const [activeTab, setActiveTab] = useState(null);

  const handleToggle = (userId, tab) => {
    if (activeUser === userId && activeTab === tab) {
      setActiveUser(null);
      setActiveTab(null);
    } else {
      setActiveUser(userId);
      setActiveTab(tab);
    }
  };

  const nonAdminUsers = users.filter(
    (user) => user.role?.toUpperCase() !== "ADMIN",
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`p-6 rounded-lg shadow-lg ${theme.card} ${theme.text}`}
    >
      <h2
        className={`text-2xl font-bold mb-6 flex items-center gap-2 ${theme.textAccent}`}
      >
        <FaUsers /> Users Management
      </h2>

      <button
        onClick={fetchUsers}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 ${theme.buttonPrimary}`}
      >
        <FaSyncAlt /> Refresh Users
      </button>

      <ul className={`mt-6 divide-y ${theme.border}`}>
        {nonAdminUsers.length > 0 ? (
          nonAdminUsers.map((user) => {
            // ✅ حساب متوسط التقييم
            const averageRating =
              Array.isArray(user.reviews) && user.reviews.length > 0
                ? (
                    user.reviews.reduce(
                      (sum, review) => sum + (review.rating || 0),
                      0,
                    ) / user.reviews.length
                  ).toFixed(1)
                : 0;

            return (
              <motion.li
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className={`py-4 px-4 rounded-md transition-all duration-300 hover:${theme.hover}`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full flex items-center justify-center">
                        <FaUsers />
                      </div>
                    )}
                    <div>
                      <p
                        className={`font-semibold capitalize ${theme.textAccent}`}
                      >
                        {user.name}
                      </p>
                      <p className="text-sm opacity-70">{user.email}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-3">
                  <button
                    onClick={() => handleToggle(user.id, "likes")}
                    className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm ${theme.buttonDanger}`}
                  >
                    <FaHeart /> {user.likes || 0} Likes
                  </button>
                  <button
                    onClick={() => handleToggle(user.id, "comments")}
                    className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm ${theme.buttonSuccess}`}
                  >
                    <FaCommentDots /> {user.reviews?.length || 0} Comments
                  </button>
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm ${theme.buttonWarning}`}
                  >
                    <FaStar className="text-yellow-500" />
                    {averageRating} / 5 ⭐ ({user.reviews?.length || 0} Reviews)
                  </div>
                </div>

                {activeUser === user.id && (
                  <div className={`mt-4 p-3 rounded-md ${theme.cardSecondary}`}>
                    {activeTab === "likes" && (
                      <p className="capitalize">
                        👍 تفاصيل الإعجابات الخاصة بـ {user.name}
                      </p>
                    )}
                    {activeTab === "comments" && (
                      <div className="space-y-3">
                        {Array.isArray(user.reviews) ? (
                          user.reviews.length > 0 ? (
                            user.reviews.map((review) => (
                              <div
                                key={review.id}
                                className={`p-3 rounded-lg shadow-md border ${theme.cardSecondary}`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <FaStar className="text-yellow-500" />
                                  <p
                                    className={`font-semibold ${theme.textAccent}`}
                                  >
                                    Rating: {review.rating}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2 mb-1">
                                  <FaCommentDots className="text-blue-500" />
                                  <p className={`${theme.text}`}>
                                    {review.comment}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2 mb-1">
                                  <FaUsers className="text-green-500" />
                                  <p className={`${theme.text}`}>
                                    Trip:{" "}
                                    {review.trip?.title?.en || review.trip_id}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2 text-xs opacity-70">
                                  <FaSyncAlt className="text-gray-400" />
                                  <small>
                                    {new Date(
                                      review.created_at,
                                    ).toLocaleDateString()}
                                  </small>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="opacity-70">No reviews available.</p>
                          )
                        ) : (
                          <div
                            className={`p-3 rounded-lg shadow-md border ${theme.cardSecondary}`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <FaStar className="text-yellow-500" />
                              <p
                                className={`font-semibold ${theme.textAccent}`}
                              >
                                Rating: {user.reviews?.rating}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 mb-1">
                              <FaCommentDots className="text-blue-500" />
                              <p className={`${theme.text}`}>
                                {user.reviews?.comment}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 mb-1">
                              <FaUsers className="text-green-500" />
                              <p className={`${theme.text}`}>
                                Trip ID: {user.reviews?.trip_id}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 text-xs opacity-70">
                              <FaSyncAlt className="text-gray-400" />
                              <small>
                                {user.reviews?.created_at &&
                                  new Date(
                                    user.reviews.created_at,
                                  ).toLocaleDateString()}
                              </small>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </motion.li>
            );
          })
        ) : (
          <p className="mt-4 capitalize opacity-70">
            No non-admin users available.
          </p>
        )}
      </ul>
    </motion.div>
  );
};

export default UsersSection;
