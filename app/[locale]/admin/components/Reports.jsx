"use client";
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveLine } from "@nivo/line";
import { FaChartBar } from "react-icons/fa";

// ✅ استدعاء الـ contexts
import { useUsers } from "../context/UserContext";
import { useTrip } from "../context/TripContext";
import { usePurchase } from "../context/PurchaseContext";

export default function Reports() {
  const { themeName } = useTheme();
  const { users } = useUsers();
  const { trips } = useTrip();
  const { purchases } = usePurchase();

  // ✅ بيانات أساسية من الـ contexts
  const stats = [
    { id: "Users", value: users.length },
    { id: "Trips", value: trips.length },
    { id: "Bookings", value: purchases.length },
    { id: "Revenue", value: 250000 }, // هنا ممكن تربطها بكونتكست لو عندك بيانات مالية
  ];

  const colors = { scheme: themeName === "dark" ? "nivo" : "set2" };

  return (
    <section className="admin-panel admin-section-panel">
      <header className="admin-section-header"><div><p className="admin-section-eyebrow"><FaChartBar /> Business intelligence</p><h2 className="admin-section-title">Reports</h2><p className="admin-section-description">A clear snapshot of the people, journeys and bookings powering the platform.</p></div><span className="admin-section-badge">Live data</span></header>

      {/* ✅ Bar Chart */}
      <div className="admin-chart-panel mb-5" style={{ height: "350px" }}>
        <div className="admin-panel-heading"><div><p className="admin-panel-kicker">Volume</p><h3>Users, trips & bookings</h3></div></div>
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
        />
      </div>

      {/* ✅ Pie Chart */}
      <div className="admin-chart-panel mb-5" style={{ height: "350px" }}>
        <div className="admin-panel-heading"><div><p className="admin-panel-kicker">Mix</p><h3>Platform distribution</h3></div></div>
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
      <div className="admin-chart-panel" style={{ height: "350px" }}>
        <div className="admin-panel-heading"><div><p className="admin-panel-kicker">Trend</p><h3>Bookings over time</h3></div></div>
        <ResponsiveLine
          data={[
            {
              id: "Bookings",
              data: purchases.map((p) => ({
                x: new Date(p.created_at).toLocaleDateString(),
                y: 1, // ممكن تجمعهم حسب التاريخ لو عايز
              })),
            },
          ]}
          margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{ type: "linear", min: "auto", max: "auto" }}
          colors={colors}
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          enableSlices="x"
        />
      </div>
    </section>
  );
}
