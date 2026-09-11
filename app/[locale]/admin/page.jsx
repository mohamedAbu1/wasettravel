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

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const { theme, themeName } = useTheme();
  const { userData, loading } = useAuth();
  const router = useRouter();
  const { locale } = useParams();


  useEffect(() => {
    if (!loading && (!userData || userData?.role?.toLowerCase() !== "admin")) {
      router.replace(`/${locale || "en"}`);
    }
  }, [loading, locale, router, userData]);

  if (loading || !userData || userData?.role?.toLowerCase() !== "admin") {
    return (
      <main className="grid min-h-screen place-items-center bg-[#0b0b0b] text-[#f4d58d]">
        <p className="rounded-xl border border-[#c9a34a]/30 px-6 py-4">Checking administrator access…</p>
      </main>
    );
  }

  return (
    <main className={`relative flex min-h-screen ${theme.background} ${theme.text}`}>
      <EgyptianBackground />

      {/* Sidebar */}
      <Sidebar setActiveSection={setActiveSection} activeSection={activeSection} themeName={themeName} locale={locale} />

      {/* Main Content */}
      <section
        className={`min-w-0 flex-1 p-4 sm:p-6 lg:p-10 relative z-10 ${
          themeName === "dark" ? "bg-black" : "bg-white"
        } rounded-tl-3xl`}
      >
        {activeSection === "dashboard" && <DashboardHome themeName={themeName} />}
        {activeSection === "addTrip" && <AddTrip themeName={themeName} />}
        {activeSection === "trips" && <TripsList themeName={themeName} />}
        {activeSection === "editTrip" && <EditTrip themeName={themeName} />}
        {activeSection === "users" && <UsersSection themeName={themeName} />}
        {activeSection === "bookings" && <BookingsList themeName={themeName} />}
        {activeSection === "reports" && <Reports themeName={themeName} />}
        {activeSection === "messages" && <MessagesList themeName={themeName} />}
        {activeSection === "currency" && <CurrencyRates themeName={themeName} />}
      </section>
    </main>
  );
}
