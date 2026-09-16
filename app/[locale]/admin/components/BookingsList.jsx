"use client";
import React from "react";
import { FaCheckCircle, FaTimesCircle, FaClipboardList, FaClock } from "react-icons/fa";
import { usePurchase } from "../context/PurchaseContext";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
export default function BookingsList() {
  const { purchases, loading, error, fetchPurchases, handleStatusChange } =
    usePurchase();
  const { i18n } = useTranslation();
  const getStatusIcon = (status) => {
    switch (status) {
      case "Confirmed":
        return <FaCheckCircle className="text-green-500" />;
      case "Pending":
        return <FaClock className="text-yellow-500" aria-label="Pending" />;
      case "Cancelled":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return null;
    }
  };

  if (loading) return <div className="admin-loading-state"><span className="admin-loading-state__spinner" />Loading bookings…</div>;
  if (error)
    return <div className="admin-empty-state admin-empty-state--error"><strong>Unable to load bookings</strong><span>{error}</span><button type="button" className="admin-action-button admin-action-button--primary" onClick={fetchPurchases}>Try again</button></div>;

  return (
    <section className="admin-panel admin-section-panel">
      {/* ✅ العنوان وعدد الحجوزات */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="admin-section-header"
      >
        <div><p className="admin-section-eyebrow">Operations</p><h2 className="admin-section-title">Bookings</h2><p className="admin-section-description">Review incoming requests and keep their status up to date.</p></div>
        <div className="admin-section-metric">
          <FaClipboardList />
          <span><strong>{purchases.length}</strong><small>Total bookings</small></span>
        </div>
      </motion.div>

      <button
        onClick={fetchPurchases}
        disabled={loading}
        aria-label="Refresh bookings"
        className="admin-action-button admin-action-button--primary mb-5"
      >
        Refresh bookings
      </button>

      {purchases.length > 0 ? (
        <div className="admin-table-shell">
        <motion.table
          className="admin-table min-w-[900px]"
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
              <th className="p-3">👥 Persons</th>
              <th className="p-3">👶 Children</th>
              <th className="p-3">📅 Arrival</th>
              <th className="p-3">📅 Departure</th>
              <th className="p-3">📱 Platform</th>
              <th className="p-3">📌 Status</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase, i) => (
                <motion.tr
                  key={purchase.id}
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
                    {purchase.userName || "Unknown User"}
                  </td>
                  <td className="p-3">
                    {(() => {
                      try {
                        const titleObj =
                          typeof purchase.tripTitle === "string"
                            ? JSON.parse(purchase.tripTitle)
                            : purchase.tripTitle;

                        return (
                          titleObj[i18n.language] ||
                          titleObj.en ||
                          "Unknown Trip"
                        );
                      } catch {
                        return purchase.tripTitle || "Unknown Trip";
                      }
                    })()}
                  </td>

                  <td className="p-3">{purchase.num_persons}</td>
                  <td className="p-3">{purchase.num_children}</td>
                  <td className="p-3">
                    {purchase.arrival_date
                      ? new Date(purchase.arrival_date).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="p-3">
                    {purchase.departure_date
                      ? new Date(purchase.departure_date).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="p-3">{purchase.platform}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(purchase.status)}

                      {purchase.status === "Cancelled" ? (
                        // ✅ حالة الإلغاء: نص ثابت فقط
                        <span className="text-red-600 font-semibold">
                          ❌ Cancelled
                        </span>
                      ) : (
                        // ✅ باقي الحالات: قائمة منسدلة للتغيير
                        <select
                          value={purchase.status}
                          onChange={(e) =>
                            handleStatusChange(purchase.id, e.target.value)
                          }
                          className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 
          text-sm font-medium text-gray-700 dark:text-gray-200 
          border border-gray-300 dark:border-gray-600 
          rounded-lg px-3 py-2 shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
          transition duration-200 ease-in-out"
                        >
                          <option
                            value="Pending"
                            className="text-yellow-600 font-semibold"
                          >
                            ⏳ Pending
                          </option>
                          <option
                            value="Confirmed"
                            className="text-green-600 font-semibold"
                          >
                            ✅ Confirmed
                          </option>
                        </select>
                      )}
                    </div>
                  </td>
                </motion.tr>
            ))}
          </tbody>
        </motion.table>
        </div>
      ) : (
        <motion.div
          className="admin-empty-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <strong>No bookings yet</strong><span>New booking requests will appear here.</span>
        </motion.div>
      )}
    </section>
  );
}
