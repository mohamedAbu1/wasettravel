import ThemeToggle from "@/components/ThemeToggle";
import React from "react";
import Link from "next/link";
import {
  FaHome,
  FaPlus,
  FaSuitcase,
  FaUsers,
  FaClipboardList,
  FaChartBar,
  FaEnvelope, // ✅ أيقونة الرسايل
} from "react-icons/fa";
import EgyptianBackground from "@/components/trips/EgyptianBackground";

export default function Sidebar({ setActiveSection }) {
  return (
    <aside className="w-64 p-6 flex flex-col gap-6 bg-black/0 border-r border-gold/30">
      <EgyptianBackground />

      <h2 className="text-2xl font-bold mb-6 flex flex-row">
        <span style={{ marginRight: "20px" }}>WasetTravel</span> <ThemeToggle />
      </h2>

      <nav className="flex flex-col gap-4">
        {/* زر العودة للصفحة الرئيسية */}
        <Link
          href="/"
          className="flex items-center gap-3 font-bold text-gold hover:text-yellow-500 transition"
        >
          ⬅ Back to Home
        </Link>

        <button
          style={{ cursor: "pointer" }}
          onClick={() => setActiveSection("dashboard")}
          className="flex items-center gap-3"
        >
          <FaHome /> Dashboard
        </button>
        <button
          style={{ cursor: "pointer" }}
          onClick={() => setActiveSection("addTrip")}
          className="flex items-center gap-3"
        >
          <FaPlus /> Add New Trip
        </button>
        <button
          style={{ cursor: "pointer" }}
          onClick={() => setActiveSection("trips")}
          className="flex items-center gap-3"
        >
          <FaSuitcase /> All Trips
        </button>
        <button
          style={{ cursor: "pointer" }}
          onClick={() => setActiveSection("users")}
          className="flex items-center gap-3"
        >
          <FaUsers /> Users
        </button>
        <button
          style={{ cursor: "pointer" }}
          onClick={() => setActiveSection("bookings")}
          className="flex items-center gap-3"
        >
          <FaClipboardList /> Bookings
        </button>
        <button
          style={{ cursor: "pointer" }}
          onClick={() => setActiveSection("reports")}
          className="flex items-center gap-3"
        >
          <FaChartBar /> Reports
        </button>
        <button
          style={{ cursor: "pointer" }}
          onClick={() => setActiveSection("messages")}
          className="flex items-center gap-3"
        >
          <FaEnvelope /> Messages
        </button>
      </nav>
    </aside>
  );
}
