"use client";
import React, { useEffect, useMemo, useState } from "react";
import { FaExclamationTriangle, FaMapMarkedAlt, FaRedo, FaTrash } from "react-icons/fa";
import { useParams } from "next/navigation";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import { useTrip } from "../context/TripContext";
import { useTripID } from "../context/TripIDContext";
import { motion } from "framer-motion";

const sameId = (left, right) => left != null && right != null && String(left) === String(right);
const parseValue = (value, fallback = null) => {
  if (value == null) return fallback;
  if (typeof value !== "string") return value;
  try { return JSON.parse(value); } catch { return value; }
};
const localizedValue = (value, locale) => {
  const parsed = parseValue(value, "");
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return parsed || "";
  return parsed[locale] || parsed.en || Object.values(parsed).find(Boolean) || "";
};
const cityLabel = (city, locale) => {
  const parsed = parseValue(city, city);
  if (typeof parsed === "number" || typeof parsed === "string") return String(parsed);
  return localizedValue(parsed?.name, locale) || parsed?.city_name || parsed?.cityName || parsed?.id || "Unknown";
};

export default function TripsList() {
  const { locale = "en" } = useParams();
  const { trips, fetchTrips, setTrips, loadingTrips, error } = useTrip();
  const { deleteTrip } = useTripID();
  const [deletingId, setDeletingId] = useState(null);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const orderedTrips = useMemo(() => (Array.isArray(trips) ? trips : []), [trips]);

  const handleDelete = async (id) => {
    if (deletingId) return;
    if (typeof window !== "undefined" && !window.confirm("Delete this trip and its related content?")) return;
    setActionError(null);
    setDeletingId(id);
    try {
      const result = await deleteTrip(id);
      if (!result?.success) throw new Error(result?.error || "Unable to delete this trip.");
      setTrips((previous) => previous.filter((trip) => !sameId(trip.id, id)));
    } catch (deleteError) {
      setActionError(deleteError.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="admin-panel admin-section-panel">
      <EgyptianBackground />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="admin-section-header"
      >
        <div><p className="admin-section-eyebrow">Journey library</p><h2 className="admin-section-title">All trips</h2><p className="admin-section-description">Manage the journeys currently available across the website.</p></div>
        <div className="admin-section-metric">
          <FaMapMarkedAlt />
          <span><strong>{trips.length}</strong><small>Published trips</small></span>
        </div>
      </motion.div>

      {(error || actionError) && (
        <div className="admin-empty-state admin-empty-state--error" role="alert">
          <FaExclamationTriangle />
          <strong>Trips could not be loaded</strong>
          <span>{actionError || error}</span>
          <button type="button" className="admin-action-button" onClick={() => { setActionError(null); fetchTrips(); }}><FaRedo /> Try again</button>
        </div>
      )}
      {loadingTrips && orderedTrips.length === 0 ? (
        <div className="admin-loading-state" aria-live="polite"><span className="admin-loading-state__spinner" /> Loading trips…</div>
      ) : !loadingTrips && !error && orderedTrips.length === 0 ? (
        <div className="admin-empty-state"><strong>No trips yet</strong><span>Create a journey to see it here.</span></div>
      ) : (
      <div className="admin-table-shell"><table className="admin-table min-w-[44rem]">
        <thead>
          <tr>
            <th className="p-3">Title</th>
            <th className="p-3">City</th>
            <th className="p-3">Price</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orderedTrips.map((trip) => {
            const cities = parseValue(trip.cities, []);
            const cityList = Array.isArray(cities) ? cities : [];
            const title = localizedValue(trip.title, locale) || "Untitled trip";
            return (
              <motion.tr
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <td className="p-3">{title}</td>
                <td className="p-3">
                  {cityList.length ? cityList.map((city) => cityLabel(city, locale)).join("  𓋹  ") : "—"}
                </td>

                <td className="p-3 font-semibold">
                  {trip.solo_price ?? "—"} {trip.currency || ""}
                </td>
                <td className="p-3">
                  <button type="button" onClick={() => handleDelete(trip.id)} disabled={deletingId != null} className="admin-action-button admin-action-button--danger">
                    <FaTrash /> {sameId(deletingId, trip.id) ? "Deleting…" : "Delete"}
                  </button>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table></div>
      )}
    </section>
  );
}
