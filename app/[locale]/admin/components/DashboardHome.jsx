"use client";
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveLine } from "@nivo/line";
import { FaUsers, FaSuitcase, FaClipboardList, FaDollarSign } from "react-icons/fa";

export default function DashboardHome() {
  const { themeName } = useTheme();

  // بيانات أساسية
  const stats = [
    { id: "Users", value: 1250 },
    { id: "Trips", value: 120 },
    { id: "Bookings", value: 3450 },
    { id: "Revenue", value: 250000 },
  ];

  // بيانات للـ Line Chart (مثال شهري)
  const lineData = [
    {
      id: "Bookings",
      color: "hsl(43, 70%, 50%)",
      data: [
        { x: "Jan", y: 300 },
        { x: "Feb", y: 450 },
        { x: "Mar", y: 600 },
        { x: "Apr", y: 800 },
        { x: "May", y: 1200 },
        { x: "Jun", y: 1500 },
      ],
    },
  ];

  const colors = themeName === "dark" ? { scheme: "nivo" } : { scheme: "set2" };

  // ✅ ستايل موحد لكل سكشن
  const sectionStyle = `p-6 rounded-xl shadow-lg ${
    themeName === "dark"
      ? "bg-black/40 border border-gold/30 text-gold"
      : "bg-white/70 border border-[#c9a34a]/30 text-[#3a2c0a] backdrop-blur-sm"
  }`;

  // ✅ كروت إحصائية سريعة
  const quickStats = [
    { title: "Users", value: "1250", icon: <FaUsers /> },
    { title: "Trips", value: "120", icon: <FaSuitcase /> },
    { title: "Bookings", value: "3450", icon: <FaClipboardList /> },
    { title: "Revenue", value: "$250K", icon: <FaDollarSign /> },
  ];

  return (
    <div className="flex flex-col gap-10 mt-6">
      {/* ✅ Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((card, i) => (
          <div
            key={i}
            className={`${sectionStyle} flex flex-col items-center justify-center gap-3 transform transition hover:scale-105`}
          >
            <div className="text-3xl">{card.icon}</div>
            <h4 className="text-lg font-bold">{card.title}</h4>
            <p className="text-2xl font-extrabold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* ✅ Bar Chart */}
      <div className={sectionStyle} style={{ height: "350px" }}>
        <h3 className="text-xl font-bold mb-4">📊 Users & Trips</h3>
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
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        />
      </div>

      {/* ✅ Pie Chart */}
      <div className={sectionStyle} style={{ height: "350px" }}>
        <h3 className="text-xl font-bold mb-4">🍩 Revenue Distribution</h3>
        <ResponsivePie
          data={stats}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          colors={colors}
          borderWidth={1}
          borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
          radialLabelsSkipAngle={10}
          radialLabelsTextColor={themeName === "dark" ? "#FFD700" : "#333"}
          radialLabelsLinkColor={{ from: "color" }}
          sliceLabelsSkipAngle={10}
          sliceLabelsTextColor="#fff"
        />
      </div>

      {/* ✅ Line Chart */}
      <div className={sectionStyle} style={{ height: "350px" }}>
        <h3 className="text-xl font-bold mb-4">📈 Bookings Over Time</h3>
        <ResponsiveLine
          data={lineData}
          margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{ type: "linear", min: "auto", max: "auto", stacked: false }}
          axisBottom={{
            legend: "Months",
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
            legend: "Bookings",
            legendOffset: -40,
            legendPosition: "middle",
          }}
          colors={colors}
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          enableSlices="x"
        />
      </div>
    </div>
  );
}
