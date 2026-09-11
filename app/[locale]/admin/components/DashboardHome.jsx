"use client";
import React, { useEffect, useMemo } from "react";
import { useTheme } from "@/context/ThemeContext";
import dynamic from "next/dynamic";
import {
  FaUsers,
  FaSuitcase,
  FaClipboardList,
  FaDollarSign,
} from "react-icons/fa";

// ✅ استدعاء الـ contexts
import { useUsers } from "../context/UserContext";
import { useTrip } from "../context/TripContext";
import { usePurchase } from "../context/PurchaseContext";

const ResponsiveBar = dynamic(() => import("@nivo/bar").then((mod) => mod.ResponsiveBar), { ssr: false });
const ResponsivePie = dynamic(() => import("@nivo/pie").then((mod) => mod.ResponsivePie), { ssr: false });
const ResponsiveLine = dynamic(() => import("@nivo/line").then((mod) => mod.ResponsiveLine), { ssr: false });

export default function DashboardHome() {
  const { themeName } = useTheme();
  const { users, fetchUsers } = useUsers();
  const { trips, fetchTrips } = useTrip();
  const { purchases, fetchPurchases } = usePurchase();

  // بيانات أساسية من الـ contexts
  const stats = [
    { id: "Users", value: users.length },
    { id: "Trips", value: trips.length },
    { id: "Bookings", value: purchases.length },
  ];

  const bookingStatus = useMemo(() => {
    const counts = purchases.reduce((result, purchase) => {
      const status = purchase.status || "Unknown";
      result[status] = (result[status] || 0) + 1;
      return result;
    }, {});
    return Object.entries(counts).map(([id, value]) => ({ id, label: id, value }));
  }, [purchases]);

  const bookingsOverTime = useMemo(() => {
    const counts = purchases.reduce((result, purchase) => {
      const date = purchase.created_at ? new Date(purchase.created_at).toLocaleDateString() : "Unknown";
      result[date] = (result[date] || 0) + 1;
      return result;
    }, {});
    return Object.entries(counts)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([x, y]) => ({ x, y }));
  }, [purchases]);

  const colors = themeName === "dark" ? { scheme: "nivo" } : { scheme: "set2" };

  const sectionStyle = `p-6 rounded-xl shadow-lg ${
    themeName === "dark"
      ? "bg-black/40 border border-gold/30 text-gold"
      : "bg-white/70 border border-[#c9a34a]/30 text-[#3a2c0a] backdrop-blur-sm"
  }`;

  const quickStats = [
    { title: "Users", value: users.length, icon: <FaUsers /> },
    { title: "Trips", value: trips.length, icon: <FaSuitcase /> },
    { title: "Bookings", value: purchases.length, icon: <FaClipboardList /> },
    { title: "Revenue", value: "Not tracked", icon: <FaDollarSign /> },
  ];
  useEffect(() => {
    fetchTrips();
    fetchPurchases();
    fetchUsers(); // ✅ تحميل تلقائي عند أول فتح
  }, []);
  return (
    <div className="mt-2 flex flex-col gap-6 sm:mt-6 sm:gap-8">

      {/* ✅ Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((card, i) => (
          <div
            key={i}
            className={`${sectionStyle} flex flex-col items-center justify-center gap-3 transform transition hover:scale-105`}
          >
            <div className="text-3xl">{card.icon}</div>
            <h4 className="text-base font-bold">{card.title}</h4>
            <p className="text-2xl font-extrabold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* ✅ Bar Chart */}
      <div className={sectionStyle} style={{ height: "350px" }}>
        <h3 className="mb-4 text-xl font-bold">Users, trips and bookings</h3>
        <div className="h-[260px] sm:h-[300px]">
        <ResponsiveBar
          data={stats}
          keys={["value"]}
          indexBy="id"
          margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
          padding={0.3}
          colors={colors}
          axisBottom={{
            legend: "Category",
            legendPosition: "middle",
            legendOffset: 40,
          }}
          axisLeft={{
            legend: "Value",
            legendPosition: "middle",
            legendOffset: -50,
          }}
        /></div>
      </div>

      {/* ✅ Pie Chart */}
      <div className={sectionStyle} style={{ height: "350px" }}>
        <h3 className="mb-4 text-xl font-bold">Booking status</h3>
        {bookingStatus.length ? <div className="h-[260px] sm:h-[300px]"><ResponsivePie
          data={bookingStatus}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          colors={colors}
        /></div> : <p className="grid h-[260px] place-items-center opacity-70">No booking data available.</p>}
      </div>

      {/* ✅ Line Chart */}
      <div className={sectionStyle} style={{ height: "350px" }}>
        <h3 className="mb-4 text-xl font-bold">Bookings over time</h3>
        {bookingsOverTime.length ? <div className="h-[260px] sm:h-[300px]"><ResponsiveLine
          data={[
            {
              id: "Bookings",
              data: bookingsOverTime,
            },
          ]}
          margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{ type: "linear", min: "auto", max: "auto" }}
          colors={colors}
        /></div> : <p className="grid h-[260px] place-items-center opacity-70">No booking data available.</p>}
      </div>
    </div>
  );
}
