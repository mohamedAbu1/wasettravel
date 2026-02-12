"use client";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import {
  FaShoppingCart,
  FaCheckCircle,
  FaTimes,
  FaChild,
  FaDog,
  FaUsers,
  FaEnvelope,
  FaUser,
  FaMoneyBillWave,
} from "react-icons/fa";
import Logo from "@/components/header/components/Logo";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import axios from "axios";
import { usePurchase } from "@/context/PurchaseContext"; // ✅ استدعاء الكونتكست
export default function PurchaseButton({ trip }) {
  const [open, setOpen] = useState(false);
  const { themeName } = useTheme();
  const { lang } = useLanguage();
  const { user } = useAuth();
  const { currency } = usePurchase(); // ✅ جلب العملة من الكونتكست
  // ✅ ألوان حسب الثيم
  const buttonClasses =
    themeName === "dark"
      ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-600 hover:to-yellow-700"
      : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700";

  const modalClasses =
    themeName === "dark"
      ? "bg-gradient-to-b from-gray-800 via-gray-900 to-black text-yellow-300"
      : "bg-gradient-to-b from-white via-gray-100 to-white text-gray-900";

  // ✅ دالة مساعدة لاختيار النص الصحيح
  const getText = (field) => {
    if (typeof field === "object" && field !== null) {
      return field[lang] || field.en || "";
    }
    return field;
  };

  // ✅ State للحقول الإضافية
  const [hasChildren, setHasChildren] = useState(false);
  const [hasPets, setHasPets] = useState(false);
  const [groupSize, setGroupSize] = useState(1);
  const [loading, setLoading] = useState(false);

  // ✅ استدعاء API للشراء
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
        setOpen(false);
      } else {
        alert("❌ " + res.data.error);
      }
    } catch (err) {
      alert("❌ " + (err.response?.data?.error || "Server error"));
    }
    setLoading(false);
  };
      let displayedPrice = trip.price;
        if (currency === "EUR" && trip.currency === "USD") {
          displayedPrice = (trip.price * 0.85).toFixed(2);
        } else if (currency === "USD" && trip.currency === "EUR") {
          displayedPrice = (trip.price * 1.18).toFixed(2);
        }
  return (
    <>
      {/* Fixed Purchase Button at bottom-left */}
      <button
        onClick={() => setOpen(true)}
        style={{ cursor: "pointer" }}
        className={`fixed bottom-6 left-6 px-6 py-3 rounded-xl font-semibold shadow-lg flex items-center gap-2 transition transform hover:scale-105 hover:shadow-2xl z-40 text-white ${buttonClasses}`}
      >
        <FaShoppingCart className="w-5 h-5 animate-bounce" />
        Buy Trip
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 transition-opacity animate-fadeIn">
          <div
            className={`rounded-2xl shadow-2xl p-8 w-[100%] max-w-lg relative transform animate-slideUp ${modalClasses}`}
          >
            <EgyptianBackground />
            {/* Close Button */}
            <button
              style={{ cursor: "pointer" }}
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition transform hover:rotate-90"
            >
              <FaTimes className="w-6 h-6" />
            </button>

            {/* Header with Logo */}
            <div className="flex items-center justify-center mb-6">
              <Logo />
            </div>

            {/* User Info from Token */}
            <div className="mb-6 border-b border-gray-300/30 pb-4">
              <h3
                className={`text-lg font-semibold mb-2 capitalize ${themeName === "dark" ? "text-[#c9a34a]" : "text-[#11111194]"}`}
              >
                Traveler Information
              </h3>
              <p
                className={`mb-1 flex items-center gap-2 capitalize ${themeName === "dark" ? "text-white" : "text-[#11111186]"}`}
              >
                <FaUser
                  className={`${themeName === "dark" ? "text-yellow-300" : "text-[#c9a34a]"}`}
                />{" "}
                {user?.name}
              </p>
              <p
                className={`mb-1 flex items-center gap-2 ${themeName === "dark" ? "text-white" : "text-[#11111186]"}`}
              >
                <FaEnvelope
                  className={`${themeName === "dark" ? "text-yellow-300" : "text-[#c9a34a]"}`}
                />{" "}
                {user?.email}
              </p>
            </div>

            {/* Extra Options */}
            <div className="mb-6 border-b border-gray-300/30 pb-4">
              <h3
                className={`text-lg font-semibold mb-3 ${themeName === "dark" ? "text-[#c9a34a]" : "text-[#11111194]"}`}
              >
                Additional Details
              </h3>

              <label
                className={`flex items-center gap-2 mb-2 cursor-pointer hover:text-[#c9a34a] transition  ${themeName === "dark" ? "text-white" : "text-[#11111186]"}`}
              >
                <input
                  type="checkbox"
                  checked={hasChildren}
                  onChange={() => setHasChildren(!hasChildren)}
                  className="accent-[#c9a34a]"
                />
                <FaChild
                  className={`${themeName === "dark" ? "text-yellow-300" : "text-[#c9a34a]"}`}
                />{" "}
                <span>Traveling with children</span>
              </label>

              <label
                className={`flex items-center gap-2 mb-2 cursor-pointer hover:text-[#c9a34a] transition  ${themeName === "dark" ? "text-white" : "text-[#11111186]"}`}
              >
                <input
                  type="checkbox"
                  checked={hasPets}
                  onChange={() => setHasPets(!hasPets)}
                  className="accent-[#c9a34a]"
                />
                <FaDog
                  className={`${themeName === "dark" ? "text-yellow-300" : "text-[#c9a34a]"}`}
                />{" "}
                <span>Traveling with pets</span>
              </label>

              <div
                className={`mt-3 flex items-center gap-2 ${themeName === "dark" ? "text-white" : "text-[#11111186]"}`}
              >
                <FaUsers
                  className={`${themeName === "dark" ? "text-yellow-300" : "text-[#c9a34a]"}`}
                />
                <label className="block mb-1 font-medium">Group Size</label>
                <input
                  type="number"
                  min="1"
                  value={groupSize}
                  onChange={(e) => setGroupSize(e.target.value)}
                  className="w-20 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Trip Details */}
            <div className="mb-6">
              <h2
                className={`text-[16px]  mb-4 flex items-center gap-2 ${themeName === "dark" ? "text-white" : "text-[#11111186]"}`}
              >
                <FaShoppingCart
                  className={`w-6 h-6 ${themeName === "dark" ? "text-yellow-300" : "text-[#c9a34a]"}`}
                />
                {getText(trip.title)}
              </h2>
              <p
                className={`mb-2 font-medium flex items-center gap-2 ${themeName === "dark" ? "text-white" : "text-[#11111186]"}`}
              >
                <FaMoneyBillWave
                  className={`${themeName === "dark" ? "text-yellow-300" : "text-[#c9a34a]"}`}
                />
                {displayedPrice} {currency || trip.currency}{" "}
                {/* ✅ عرض العملة من localStorage */}
              </p>
            </div>

            {/* Confirm Button */}
            <button
              style={{ cursor: "pointer" }}
              onClick={handlePurchase}
              disabled={loading}
              className={`mt-4 w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition text-white transform hover:scale-105 hover:shadow-xl ${
                themeName === "dark"
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
                  : "bg-gradient-to-r bg-[#c9a34a] hover:from-blue-600 hover:to-blue-700"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <FaCheckCircle className="w-5 h-5 animate-pulse" />
              {loading ? "Processing..." : "Book Now"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
