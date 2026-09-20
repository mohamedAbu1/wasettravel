/* eslint-disable react-hooks/purity */
"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import Sidebar from "./components/Sidebar";
import DashboardHome from "./components/DashboardHome";
import AddTrip from "./components/AddTrip";
import TripsList from "./components/TripsList";
import BookingsList from "./components/BookingsList";
import Reports from "./components/Reports";
import MessagesList from "./components/MessagesList";
import EditTrip from "./components/EditTrip"; 
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import UsersSection from "./components/UsersSection";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";
import CurrencyRates from "./components/CurrencyRates";
import { FaBell, FaChevronRight, FaShieldAlt } from "react-icons/fa";

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const { theme, themeName } = useTheme();
  const { userData, loading } = useAuth();
  const router = useRouter();
  const { locale } = useParams();
  const isPrimaryAdmin = String(userData?.email || "").trim().toLowerCase() === "wasettraveleg@gmail.com";


  useEffect(() => {
    if (!loading && (!userData || !isPrimaryAdmin)) {
      router.replace(`/${locale || "en"}`);
    }
  }, [loading, locale, router, userData]);

  if (loading || !userData || !isPrimaryAdmin) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#0b0b0b] text-[#f4d58d]">
        <p className="rounded-xl border border-[#c9a34a]/30 px-6 py-4">Checking administrator access…</p>
      </main>
    );
  }

  const sectionTitles = { dashboard: "Overview", addTrip: "Add new trip", trips: "All trips", editTrip: "Edit trips", users: "Users", bookings: "Bookings", reports: "Reports", messages: "Messages", currency: "Currency rates" };

  return (
    <main className={`admin-shell relative flex min-h-screen ${theme.background} ${theme.text}`}>
      <EgyptianBackground />

      {/* Sidebar */}
      <Sidebar setActiveSection={setActiveSection} activeSection={activeSection} themeName={themeName} locale={locale} />

      {/* Main Content */}
      <section className="admin-main relative z-10 min-w-0 flex-1">
        <header className="admin-topbar"><div><p className="admin-eyebrow"><FaShieldAlt /> WasetTravel administration</p><h1>{sectionTitles[activeSection] || "Dashboard"}</h1><p className="admin-topbar__sub">Manage journeys, guests and operations from one calm workspace.</p></div><div className="admin-topbar__actions"><span className="admin-live-status"><span /> System operational</span><button type="button" className="admin-icon-button" aria-label="Notifications"><FaBell /></button><div className="admin-user-chip"><span>{(userData.name || userData.email || "A").slice(0, 1).toUpperCase()}</span><div><strong>{userData.name || "Administrator"}</strong><small>Administrator</small></div><FaChevronRight /></div></div></header>
        <div className="admin-content">
        {activeSection === "dashboard" && <DashboardHome themeName={themeName} />}
        {activeSection === "addTrip" && <AddTrip themeName={themeName} />}
        {activeSection === "trips" && <TripsList themeName={themeName} />}
        {activeSection === "editTrip" && <EditTrip themeName={themeName} />}
        {activeSection === "users" && <UsersSection themeName={themeName} />}
        {activeSection === "bookings" && <BookingsList themeName={themeName} />}
        {activeSection === "reports" && <Reports themeName={themeName} />}
        {activeSection === "messages" && <MessagesList themeName={themeName} />}
        {activeSection === "currency" && <CurrencyRates themeName={themeName} />}
        </div>
      </section>
    </main>
  );
}
