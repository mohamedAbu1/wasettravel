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
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ activeSection, setActiveSection, locale = "en", mobileOpen = false, onClose }) {
  const { logout } = useAuth();
  // ✅ دالة لتوليد زر مع حالة Active
  const NavButton = ({ section, icon, label }) => {
    const isActive = activeSection === section;
    return (
      <button
        type="button"
        aria-current={isActive ? "page" : undefined}
        onClick={() => {
          setActiveSection(section);
          onClose?.();
        }}
        className={`admin-nav-item ${isActive ? "is-active" : ""}`}
      >
        {/* ✅ خط جانبي يوضح الزر النشط */}
        {isActive && <span className="admin-nav-item__active" />}

        {/* ✅ أيقونة مع تأثير عند النشط */}
        <span
          className="admin-nav-item__icon"
        >
          {icon}
        </span>
        {label}
      </button>
    );
  };

  return (
    <aside className={`admin-sidebar ${mobileOpen ? "is-mobile-open" : ""}`}>
      <div className="admin-brand"><span className="admin-brand__mark">W</span><div><strong>Waset<span>Travel</span></strong><small>Admin workspace</small></div><ThemeToggle /><button type="button" className="admin-mobile-close" aria-label="Close admin navigation" onClick={onClose}><FaTimes /></button>
      </div>

      <nav aria-label="Admin navigation" className="admin-nav">
        <Link
          href={`/${locale}`}
          className="admin-back-link"
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
          onClick={async () => {
            await logout();
            window.location.assign(`/${locale || "en"}`);
          }}
          className="admin-signout"
        >
          <span aria-hidden="true">↪</span> Sign out
        </button>
      </nav>
    </aside>
  );
}
