"use client";
import { FaCheckCircle } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

export default function ConfirmButton({ trip, onClose, hasChildren, hasPets, groupSize }) {
  const { themeName } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    if (!user) {
      alert("❌ You must be logged in to purchase a trip.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/purchase", {
        tripId: trip.id,
        hasChildren,
        hasPets,
        groupSize,
      });

      if (res.status === 200) {
        alert("✅ Trip booked successfully!");
        onClose();
      } else {
        alert("❌ " + res.data.error);
      }
    } catch (err) {
      alert("❌ " + (err.response?.data?.error || "Server error"));
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handlePurchase}
      disabled={loading}
      className={`mt-4 w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition text-white transform hover:scale-105 hover:shadow-xl ${
        themeName === "dark"
          ? "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
          : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <FaCheckCircle className="w-5 h-5 animate-pulse" />
      {loading ? "Processing..." : "Book Now"}
    </button>
  );
}
