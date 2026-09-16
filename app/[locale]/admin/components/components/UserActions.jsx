import React from "react";
import { FaHeart, FaCommentDots, FaStar } from "react-icons/fa";
import { useReviews } from "@/context/ReviewsContext";

const UserActions = ({ user, handleToggle }) => {
  const { getUserLikes } = useReviews();

  const averageRating =
    Array.isArray(user.reviews) && user.reviews.length > 0
      ? (
          user.reviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
          user.reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div className="admin-user-actions">
      <button onClick={() => handleToggle(user.id, "likes")} className="admin-user-action admin-user-action--danger">
        <FaHeart /> {getUserLikes(user.id).reduce((sum, r) => sum + r.likes, 0)} Likes
      </button>
      <button onClick={() => handleToggle(user.id, "comments")} className="admin-user-action admin-user-action--success">
        <FaCommentDots /> {user.reviews?.length || 0} Comments
      </button>
      <div className="admin-user-action admin-user-action--rating">
        <FaStar /> {averageRating} / 5
      </div>
    </div>
  );
};

export default UserActions;
