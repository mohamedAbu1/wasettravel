/* eslint-disable react-hooks/static-components */
"use client";
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
  FaEnvelope,
  FaEdit,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ activeSection, setActiveSection, locale = "en" }) {
  const { logout } = useAuth();
  // ✅ دالة لتوليد زر مع حالة Active
  const NavButton = ({ section, icon, label }) => {
    const isActive = activeSection === section;
    return (
      <button
        type="button"
        aria-current={isActive ? "page" : undefined}
        onClick={() => setActiveSection(section)}
        className={`flex items-center gap-3 px-4 py-2 rounded-lg font-semibold transition-all duration-300 relative cursor-pointer
          ${
            isActive
              ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-lg border-l-4 border-yellow-500"
              : "text-gold hover:text-yellow-400 hover:bg-black/20"
          }`}
      >
        {/* ✅ خط جانبي يوضح الزر النشط */}
        {isActive && <span className="absolute inset-y-0 left-0 w-1 rounded-r bg-yellow-500" />}

        {/* ✅ أيقونة مع تأثير عند النشط */}
        <span
          className={`text-lg transition-transform ${
            isActive ? "scale-110 text-yellow-800 drop-shadow-md" : ""
          }`}
        >
          {icon}
        </span>
        {label}
      </button>
    );
  };

  return (
    <aside className="w-full shrink-0 border-b border-gold/30 bg-black/10 p-4 lg:w-64 lg:border-b-0 lg:border-r lg:p-6">

      <div className="mb-4 flex items-center justify-between gap-3 lg:mb-6">
        <span>WasetTravel</span> <ThemeToggle />
      </div>

      <nav aria-label="Admin navigation" className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:flex-col lg:gap-3">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-3 font-bold text-gold hover:text-yellow-500 transition"
        >
          <span aria-hidden="true">←</span> Back to Home
        </Link>

        <NavButton section="dashboard" icon={<FaHome />} label="Dashboard" />
        <NavButton section="addTrip" icon={<FaPlus />} label="Add New Trip" />
        <NavButton section="trips" icon={<FaSuitcase />} label="All Trips" />
        <NavButton section="editTrip" icon={<FaEdit />} label="Edit Trips" />
        <NavButton section="users" icon={<FaUsers />} label="Users" />
        <NavButton section="bookings" icon={<FaClipboardList />} label="Bookings" />
        <NavButton section="reports" icon={<FaChartBar />} label="Reports" />
        <NavButton section="messages" icon={<FaEnvelope />} label="Messages" />
        <NavButton section="currency" icon={<FaChartBar />} label="Currency Rates" />
        <button
          type="button"
          onClick={() => {
            logout();
            window.location.assign(`/${locale}`);
          }}
          className="mt-2 flex items-center gap-3 rounded-lg px-4 py-2 font-semibold text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
        >
          <span aria-hidden="true">↪</span> Sign out
        </button>
      </nav>
    </aside>
  );
}
