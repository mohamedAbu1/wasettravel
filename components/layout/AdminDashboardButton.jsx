"use client";
import React from "react";
import { FaTachometerAlt } from "react-icons/fa"; // أيقونة الداش بورد
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminDashboardButton() {
  const { userData } = useAuth();
  const router = useRouter();
  const { lang } = useLanguage();
  // ✅ تحقق من أن المستخدم أدمن
  const isAdmin = userData?.role?.toLowerCase() === "admin";

  const goToDashboard = () => {
    router.push(`/${lang}/admin`);
  };

  if (!isAdmin) return null; // الزر يظهر فقط للأدمن

  return (
     <motion.button
      style={{ cursor: "pointer" }}
      onClick={goToDashboard}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Open admin dashboard"
      className="fixed bottom-5 right-5 z-[90] hidden items-center gap-3 rounded-2xl border border-[#e0b873]/35 bg-[#30271d] px-5 py-3 text-sm font-bold tracking-wide text-[#f8f1e7] shadow-[0_1rem_2.5rem_rgba(32,24,17,.28)] transition hover:-translate-y-1 hover:bg-[#211a13] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8f5d2e]/30 lg:flex"
    >
      <FaTachometerAlt size={22} />
      <span>Dashboard</span>
    </motion.button>
  );
}
