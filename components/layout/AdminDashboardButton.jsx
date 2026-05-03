"use client";
import React from "react";
import { FaTachometerAlt } from "react-icons/fa"; // أيقونة الداش بورد
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function AdminDashboardButton() {
  const { user } = useAuth();
  const router = useRouter();

  // ✅ تحقق من أن المستخدم أدمن
  const isAdmin = user?.user_metadata?.role === "ADMIN";

  const goToDashboard = () => {
    router.push("/admin"); // المسار الخاص بلوحة التحكم
  };

  if (!isAdmin) return null; // الزر يظهر فقط للأدمن

  return (
    <motion.button
      style={{ cursor: "pointer" }}
      onClick={goToDashboard}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold"
    >
      <FaTachometerAlt size={20} />
      <span>Dashboard</span>
    </motion.button>
  );
}
