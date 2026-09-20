"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext"; 

const ReviewsContext = createContext();
const sameId = (left, right) => left != null && right != null && String(left) === String(right);

export function ReviewsProvider({ children }) {
  const { userData } = useAuth(); 
  const [reviewsByTrip, setReviewsByTrip] = useState({});
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState({});
  const [likePending, setLikePending] = useState({});
  // ✅ جلب التعليقات الخاصة برحلة معينة
  const fetchReviewsByTrip = async (tripId) => {
    if (!tripId) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/reviews?tripId=${tripId}`);
      const data = res.data?.reviews || [];
      const filtered = data.filter((review) => sameId(review.trip_id, tripId));

      setReviewsByTrip((prev) => ({ ...prev, [tripId]: filtered }));

      filtered.forEach((review) => {
        if (review?.id) fetchLikes(review.id);
      });
    } catch (err) {
      console.error("❌ Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ جلب جميع التعليقات
  const fetchAllReviews = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/reviews`);
      const data = res.data?.reviews || [];
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

  useEffect(() => {
    fetchAllReviews();
  }, []);

  // ✅ إضافة تعليق جديد
  const addReview = async (review) => {
    if (!review.trip_id || !userData?.id) {
      return { success: false, error: "No user or trip ID" };
    }

    try {
      const res = await axios.post(`/api/reviews`, {
        trip_id: review.trip_id,
        rating: review.rating,
        comment: String(review.comment || "").trim(),
        name: review.name || userData.name || userData.email,
        avatar_url: userData.avatar_url || userData?.image,
        time: review.time,
      }, { withCredentials: true });

      const data = res.data;
      if (data.success) {
        const createdReview = data.review;
        setReviewsByTrip((prev) => ({
          ...prev,
          [review.trip_id]: [createdReview, ...(prev[review.trip_id] || []).filter((item) => !sameId(item.id, createdReview.id))],
        }));
        setAllReviews((prev) => [createdReview, ...prev.filter((item) => !sameId(item.id, createdReview.id))]);
        setLikes((prev) => ({ ...prev, [createdReview.id]: { count: 0, users: [] } }));
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
      const res = await axios.get(`/api/reviews/${reviewId}/like`);
      setLikes((prev) => ({
        ...prev,
        [reviewId]: {
          count: Number(res.data?.count || 0),
          users: Array.isArray(res.data?.users) ? res.data.users : [],
        },
      }));
    } catch (err) {
      console.error("❌ Error fetching likes:", err);
    }
  };

  const addLike = async (reviewId) => {
    if (!reviewId || !userData?.id || likePending[reviewId]) return { error: "Login required or request pending" };
    const currentUsers = likes[reviewId]?.users || [];
    if (currentUsers.some((id) => sameId(id, userData.id))) return { ok: true, alreadyLiked: true };
    setLikePending((prev) => ({ ...prev, [reviewId]: true }));

    try {
      const res = await axios.post(`/api/reviews/${reviewId}/like`, { user_id: userData.id });
      if (res.data?.ok) {
        setLikes((prev) => ({
          ...prev,
          [reviewId]: {
            count: Number(res.data.count ?? (prev[reviewId]?.count || 0) + 1),
            users: res.data.users || [...(prev[reviewId]?.users || []), userData.id],
          },
        }));
      }
      return res.data;
    } catch (err) {
      console.error("❌ Error adding like:", err);
      return { error: err.response?.data?.error || err.message };
    } finally {
      setLikePending((prev) => ({ ...prev, [reviewId]: false }));
    }
  };


  // ✅ إزالة لايك
  const removeLike = async (reviewId) => {
    if (!userData?.id || !reviewId || likePending[reviewId]) return { error: "Login required or request pending" };
    setLikePending((prev) => ({ ...prev, [reviewId]: true }));

    try {
      const res = await axios.delete(`/api/reviews/${reviewId}/like`, {
        data: { user_id: userData.id },
      });

      if (!res.data?.error) {
        setLikes((prev) => ({
          ...prev,
          [reviewId]: {
            count: Number(res.data.count ?? Math.max((prev[reviewId]?.count || 1) - 1, 0)),
            users: res.data.users || (prev[reviewId]?.users || []).filter((id) => !sameId(id, userData.id)),
          },
        }));
      }
      return res.data;
    } catch (err) {
      console.error("❌ Error removing like:", err);
      return { error: err.response?.data?.error || err.message };
    } finally {
      setLikePending((prev) => ({ ...prev, [reviewId]: false }));
    }
  };

  const isLiked = (reviewId, userId = userData?.id) =>
    Boolean(userId && likes[reviewId]?.users?.some((id) => sameId(id, userId)));

  // ✅ جلب لايكات المستخدم
  const getUserLikes = (userId) => {
    if (!userId) return [];

    const userReviews = allReviews.filter((review) => sameId(review.user_id, userId));

    return userReviews.map((review) => ({
      reviewId: review.id,
      tripId: review.trip_id,
      tripTitle: review.trip?.title?.en || "Unknown Trip",
      comment: review.comment,
      rating: review.rating,
      authorName: review.name,
      likes: likes[review.id]?.count || 0,
      users: likes[review.id]?.users || [],
    }));
  };

  const updateReview = async (reviewId, changes) => {
    if (!reviewId || !userData?.id) return { success: false, error: "Login required" };
    try {
      const res = await axios.put(`/api/reviews/${reviewId}`, {
        comment: String(changes.comment || "").trim(),
        rating: Number(changes.rating),
      }, { withCredentials: true });
      const data = res.data;
      if (data.ok) {
        const update = (review) => sameId(review.id, reviewId) ? { ...review, comment: String(changes.comment).trim(), rating: Number(changes.rating) } : review;
        setReviewsByTrip((prev) => Object.fromEntries(Object.entries(prev).map(([key, reviews]) => [key, reviews.map(update)])));
        setAllReviews((prev) => prev.map(update));
      }
      return { ...data, success: Boolean(data.ok) };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || err.message };
    }
  };

  const deleteReview = async (reviewId) => {
  if (!reviewId) {
    return { success: false, error: "Missing reviewId" };
  }
  if (!userData?.id) return { success: false, error: "Login required" };

  try {
    const res = await axios.delete(`/api/reviews/${reviewId}`, {
      withCredentials: true,
    });

    const data = res.data;
    if (data.success || data.ok) {
      // تحديث التعليقات الخاصة بالرحلة
      setReviewsByTrip((prev) => Object.fromEntries(Object.entries(prev).map(([key, reviews]) => [key, reviews.filter((review) => !sameId(review.id, reviewId))])));

      // تحديث جميع التعليقات
      setAllReviews((prev) => prev.filter((review) => !sameId(review.id, reviewId)));

      // إزالة اللايكات الخاصة بالتعليق المحذوف
      setLikes((prev) => {
        const updated = { ...prev };
        delete updated[reviewId];
        return updated;
      });
    }

    return { ...data, success: Boolean(data.success || data.ok) };
  } catch (err) {
    console.error("❌ Error deleting review:", err);
    return { success: false, error: err.message };
  }
  };

  return (
    <ReviewsContext.Provider
      value={{
        reviewsByTrip,
        allReviews,
        loading,
        userData,
        likes,
        fetchReviewsByTrip,
        fetchAllReviews,
        addReview,
        updateReview,
        fetchLikes,
        addLike,
        removeLike,
        isLiked,
        likePending,
        getUserLikes,
        deleteReview,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  return useContext(ReviewsContext);
}
