import React from "react";
import { FaHeart, FaCommentDots, FaStar } from "react-icons/fa";

const UserActions = ({ user, handleToggle }) => {
  const likesCount = Number(user?.likes_count || 0);
  const commentsCount = Number(user?.comments_count || 0);
  const averageRating = Number(user?.average_rating || 0).toFixed(1);

  return (
    <div className="admin-user-actions">
      <button onClick={() => handleToggle(user.id, "likes")} className="admin-user-action admin-user-action--danger">
        <FaHeart /> {likesCount} Likes
      </button>
      <button onClick={() => handleToggle(user.id, "comments")} className="admin-user-action admin-user-action--success">
        <FaCommentDots /> {commentsCount} Comments
      </button>
      <div className="admin-user-action admin-user-action--rating">
        <FaStar /> {averageRating} / 5
      </div>
    </div>
  );
};

export default UserActions;
