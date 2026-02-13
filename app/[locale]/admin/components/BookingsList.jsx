"use client";
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { FaCheckCircle, FaTimesCircle, FaClipboardList } from "react-icons/fa";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import { usePurchase } from "../context/PurchaseContext";
import { motion } from "framer-motion";
import DividerWithIcon from "@/components/layout/DividerWithIcon";

export default function BookingsList() {
  const { themeName } = useTheme();
  const { purchases, loading, error, fetchPurchases } = usePurchase();

  const getStatusIcon = (status) => {
    switch (status) {
      case "Confirmed":
        return <FaCheckCircle className="text-green-500" />;
      case "Pending":
        return <FaTimesCircle className="text-yellow-500" />;
      case "Cancelled":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return null;
    }
  };

  if (loading) return <p className="text-center">⏳ Loading bookings...</p>;
  if (error) return <p className="text-center text-red-500">❌ Error: {error}</p>;

  return (
    <div
      className={`rounded-xl shadow-lg p-6 ${
        themeName === "dark"
          ? "bg-black/40 border border-gold/30 text-white"
          : "bg-white/70 border border-[#c9a34a]/30 text-[#3a2c0a] backdrop-blur-sm"
      }`}
    >
      <EgyptianBackground />

      {/* ✅ العنوان وعدد الحجوزات */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between mb-6"
      >
        <h2
          className={`text-2xl font-bold ${
            themeName === "dark"
              ? "text-gold"
              : "bg-gradient-to-r from-[#c9a34a] to-[#eab308] bg-clip-text text-transparent"
          }`}
        >
          ✨ Bookings
        </h2>
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md ${
            themeName === "dark"
              ? "bg-gold/20 text-gold"
              : "bg-[#fdf6e3] text-[#3a2c0a]"
          }`}
        >
          <FaClipboardList />
          <span className="font-semibold">Total: {purchases.length}</span>
        </div>
      </motion.div>

      <button
        onClick={fetchPurchases}
        className="mb-4 px-4 py-2 rounded-lg bg-gradient-to-r from-[#c9a34a] to-[#eab308] text-white hover:scale-105 transition-transform shadow-md"
      >
        🔄 Refresh Bookings
      </button>

      {purchases.length > 0 ? (
        <motion.table
          className="w-full text-left border-collapse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <thead>
            <tr
              className={`${
                themeName === "dark"
                  ? "bg-gold/20 text-gold"
                  : "bg-[#fdf6e3] text-[#3a2c0a]"
              }`}
            >
              <th className="p-3">👤 User</th>
              <th className="p-3">🗺️ Trip</th>
              <th className="p-3">📅 Date</th>
              <th className="p-3">📌 Status</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase, i) => (
              <>
                <DividerWithIcon />
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className={`transition hover:scale-[1.02] ${
                    themeName === "dark"
                      ? "hover:bg-gold/10"
                      : "hover:bg-[#fdf6e3]/50"
                  }`}
                >
                  <td className="p-3 font-semibold capitalize">
                    {purchase.users?.name || "Unknown User"}
                  </td>
                  <td className="p-3">
                    {purchase.trips?.title?.en || "Unknown Trip"}
                  </td>
                  <td className="p-3">
                    {purchase.created_at
                      ? new Date(purchase.created_at).toLocaleDateString()
                      : "No date"}
                  </td>
                  <td className="p-3 flex items-center gap-2">
                    {getStatusIcon("Confirmed")} {purchase.status || "Confirmed"}
                  </td>
                </motion.tr>
                <DividerWithIcon />
              </>
            ))}
          </tbody>
        </motion.table>
      ) : (
        <motion.p
          className="opacity-70 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          No bookings available.
        </motion.p>
      )}
    </div>
  );
}
