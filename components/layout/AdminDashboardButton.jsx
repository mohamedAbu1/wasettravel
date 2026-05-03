"use client";
import React from "react";
import { FaTachometerAlt } from "react-icons/fa"; // أيقونة الداش بورد
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export default function AdminDashboardButton() {
  const { user } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();
  console.log("Role:", user?.user_metadata?.role);
  // ✅ تحقق من أن المستخدم أدمن
  const isAdmin = user?.user_metadata?.role?.includes("ADMIN");

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
      className={`fixed bottom-8 right-6 p-4 rounded-full shadow-lg flex items-center justify-center ${theme.buttonPrimary}`}
    >
      <FaTachometerAlt size={20} />
    </motion.button>
  );
}
