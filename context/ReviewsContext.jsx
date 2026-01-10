"use client";
import { createContext, useContext, useState, useEffect } from "react";

const ReviewsContext = createContext();

export function ReviewsProvider({ children }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [likes, setLikes] = useState({}); // تخزين عدد اللايكات لكل تعليق

  // جلب الريفيوهات من الـ API
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews");
      const data = await safeJson(res);
      setReviews(data || []);
    } catch (err) {
      console.error("❌ Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  // إضافة ريفيو جديد
  const addReview = async (newReview) => {
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });
      const data = await safeJson(res);
      if (data) {
        setReviews((prev) => [...prev, data]);
      }
    } catch (err) {
      console.error("❌ Error adding review:", err);
    }
  };

  // جلب المستخدم الحالي
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await safeJson(res);
        setUser(data || null);
      } catch (err) {
        console.error("❌ Error fetching user:", err);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  // جلب اللايكات لكل تعليق
  const fetchLikes = async (reviewId) => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}/likes`);
      const data = await safeJson(res);
      setLikes((prev) => ({ ...prev, [reviewId]: data?.count || 0 }));
    } catch (err) {
      console.error("❌ Error fetching likes:", err);
    }
  };

  // إضافة لايك
  const addLike = async (reviewId) => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}/like`, {
        method: "POST",
      });
      const data = await safeJson(res);
      if (data?.error) {
        alert("⚠️ " + data.error);
      } else {
        setLikes((prev) => ({
          ...prev,
          [reviewId]: (prev[reviewId] || 0) + 1,
        }));
      }
    } catch (err) {
      console.error("❌ Error adding like:", err);
    }
  };

  // إزالة لايك
  const removeLike = async (reviewId) => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}/like`, {
        method: "DELETE",
      });
      const data = await safeJson(res);
      if (data?.error) {
        alert("⚠️ " + data.error);
      } else {
        setLikes((prev) => ({
          ...prev,
          [reviewId]: Math.max((prev[reviewId] || 1) - 1, 0),
        }));
      }
    } catch (err) {
      console.error("❌ Error removing like:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        loading,
        addReview,
        user,
        likes,
        fetchLikes,
        addLike,
        removeLike,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  );
}

// دالة مساعدة للتعامل مع JSON بأمان
async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null; // لو الاستجابة فاضية
  }
}

export function useReviews() {
  return useContext(ReviewsContext);
}
