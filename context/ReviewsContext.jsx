"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const ReviewsContext = createContext();

export function ReviewsProvider({ children }) {
  const [reviewsByTrip, setReviewsByTrip] = useState({}); // { tripId: [reviews] }
  const [allReviews, setAllReviews] = useState([]); // جميع التعليقات (اختياري)
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [likes, setLikes] = useState({}); // { reviewId: { count, users } }

  // ✅ جلب المستخدم من API
  const fetchUser = async () => {
    try {
      const res = await axios.get("/api/auth/me", { withCredentials: true });
      setUser(res.data?.user || null);
    } catch (err) {
      console.error("❌ Error fetching user:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // ✅ جلب التعليقات الخاصة برحلة معينة
const fetchReviewsByTrip = async (tripId) => {
  if (!tripId) {
    console.log("⚠️ No tripId provided to fetchReviewsByTrip");
    return;
  }
  setLoading(true);
  try {
    console.log("➡️ Fetching reviews for trip:", tripId);
    const res = await axios.get(`/api/reviews?tripId=${tripId}`, {
      withCredentials: true,
    });
    console.log("📥 Raw response from API:", res.data);

    const data = res.data?.reviews || [];
    console.log("📦 Extracted reviews array:", data);

    const filtered = data.filter((review) => review.trip_id === tripId);
    console.log("✅ Filtered reviews for trip:", tripId, filtered);

    setReviewsByTrip((prev) => ({ ...prev, [tripId]: filtered }));

    filtered.forEach((review) => {
      if (review?.id) {
        console.log("➡️ Fetching likes for review:", review.id);
        fetchLikes(review.id);
      }
    });
  } catch (err) {
    console.error("❌ Error fetching reviews:", err);
  } finally {
    setLoading(false);
  }
};


  // ✅ جلب جميع التعليقات (لكل الرحلات)
  const fetchAllReviews = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/reviews`, { withCredentials: true });
      const data = res.data || [];
      setAllReviews(data);

      const grouped = {};
      data.forEach((review) => {
        if (review.trip_id) {
          if (!grouped[review.trip_id]) grouped[review.trip_id] = [];
          grouped[review.trip_id].push(review);

          if (review?.id) fetchLikes(review.id);
        }
      });
      setReviewsByTrip(grouped);
    } catch (err) {
      console.error("❌ Error fetching all reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ إضافة تعليق جديد
// ✅ إضافة تعليق جديد
const addReview = async (review) => {
  if (!review.trip_id || !user?.id) {
    console.log("⚠️ Missing trip_id or user.id in addReview:", review, user);
    return { success: false, error: "No user or trip ID" };
  }

  try {
    console.log("➡️ Sending new review to API:", review);
    const res = await axios.post(
      `/api/reviews`,
      {
        trip_id: review.trip_id,
        user_id: user.id,
        rating: review.rating,
        comment: review.comment,
        name: review.name,
        avatar_url: review.avatar_url,
        time: review.time,
      },
      { withCredentials: true },
    );

    console.log("📥 Raw response from API (addReview):", res.data);

    const data = res.data;
    if (data.success) {
      console.log("✅ Review successfully saved in DB:", data.review);
      setReviewsByTrip((prev) => ({
        ...prev,
        [review.trip_id]: [...(prev[review.trip_id] || []), data.review],
      }));
    } else {
      console.log("⚠️ API returned failure:", data);
    }
    return data;
  } catch (err) {
    console.error("❌ Error adding review:", err);
    return { success: false, error: err.message };
  }
};


  // ✅ جلب اللايكات
  const fetchLikes = async (reviewId) => {
    try {
      const res = await axios.get(`/api/reviews/${reviewId}/like`, {
        withCredentials: true,
      });
      setLikes((prev) => ({
        ...prev,
        [reviewId]: {
          count: res.data?.count || 0,
          users: res.data?.users || [],
        },
      }));
    } catch (err) {
      console.error("❌ Error fetching likes:", err);
    }
  };

  // ✅ إضافة لايك
  const addLike = async (reviewId) => {
    if (!reviewId || !user?.id) return;
    if (likes[reviewId]?.users?.includes(user.id)) return;

    try {
      const res = await axios.post(`/api/reviews/${reviewId}/like`, null, {
        withCredentials: true,
      });
      if (!res.data?.error) {
        setLikes((prev) => ({
          ...prev,
          [reviewId]: {
            count: (prev[reviewId]?.count || 0) + 1,
            users: [...(prev[reviewId]?.users || []), user.id],
          },
        }));
      }
    } catch (err) {
      console.error("❌ Error adding like:", err);
    }
  };

  // ✅ إزالة لايك
  const removeLike = async (reviewId) => {
    if (!user?.id) return;
    try {
      const res = await axios.delete(`/api/reviews/${reviewId}/like`, {
        withCredentials: true,
      });
      if (!res.data?.error) {
        setLikes((prev) => ({
          ...prev,
          [reviewId]: {
            count: Math.max((prev[reviewId]?.count || 1) - 1, 0),
            users: (prev[reviewId]?.users || []).filter((id) => id !== user.id),
          },
        }));
      }
    } catch (err) {
      console.error("❌ Error removing like:", err);
    }
  };

  return (
    <ReviewsContext.Provider
      value={{
        reviewsByTrip,
        allReviews,
        loading,
        user,
        likes,
        fetchReviewsByTrip,
        fetchAllReviews,
        addReview, // ✅ الآن متاح
        fetchLikes,
        addLike,
        removeLike,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  return useContext(ReviewsContext);
}
