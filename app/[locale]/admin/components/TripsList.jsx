"use client";
import React, { useEffect } from "react";
import { FaTrash, FaMapMarkedAlt } from "react-icons/fa";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import { useTrip } from "../context/TripContext";
import { useTripID } from "../context/TripIDContext";
import DividerWithIcon from "@/components/layout/DividerWithIcon";
import { motion } from "framer-motion";

export default function TripsList() {
  const { trips, fetchTrips, setTrips } = useTrip();
  const { deleteTrip } = useTripID();

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDelete = async (id) => {
    const result = await deleteTrip(id);
    if (result.success) {
      setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== id));
    }
  };

  return (
    <section className="admin-panel admin-section-panel">
      <EgyptianBackground />

      {/* ✅ عدد الرحلات */}
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

      <div className="admin-table-shell"><table className="admin-table min-w-[44rem]">
        <thead>
          <tr
            className={`${
              themeName === "dark"
                ? "bg-gold/20 text-gold"
                : "bg-[#fdf6e3] text-[#3a2c0a]"
            }`}
          >
            <th className="p-3">Title</th>
            <th className="p-3">City</th>
            <th className="p-3">Price</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip) => (
            <React.Fragment key={trip.id}>
              <motion.tr
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`transition hover:scale-[1.01] ${
                  themeName === "dark"
                    ? "hover:bg-gold/10"
                    : "hover:bg-[#fdf6e3]/50"
                }`}
              >
                <td className="p-3">{trip.title?.en || trip.title}</td>
                <td className="p-3">
                  {Array.isArray(trip.cities)
                    ? trip.cities
                        .map((c) => {
                          // ✅ اطبع بيانات المدينة في الـ console

                          // ✅ استخرج الـ id
                          const cityId =
                            typeof c === "number"
                              ? c
                              : c?.id || c?.city_id || c?.cityId;

                          // ✅ ابحث عن المدينة في قائمة allCities (لو عندك Context للمدن)
                          // const cityObj = allCities.find((city) => city.id === cityId);

                          // ✅ الاسم النهائي
                          const cityName =
                            typeof c?.name === "object"
                              ? c.name.en ||
                                c.name.ar ||
                                Object.values(c.name)[0]
                              : c?.name || "Unknown";

                          return cityName;
                        })
                        .join("  𓋹  ")
                    : "—"}
                </td>

                <td className="p-3 font-semibold">
                  {trip.solo_price} {trip.currency}
                </td>
                <td className="p-3 flex gap-3">
                  <button
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDelete(trip.id)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-bold transition ${
                      themeName === "dark"
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    <FaTrash /> Delete
                  </button>
                </td>
              </motion.tr>
              <DividerWithIcon />
            </React.Fragment>
          ))}
        </tbody>
      </table></div>
    </section>
  );
}
