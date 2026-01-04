import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { FaUsers, FaSuitcase, FaClipboardList, FaDollarSign } from "react-icons/fa";

export default function DashboardHome() {
  const { themeName } = useTheme();

  const cards = [
    { title: "Users", value: "1250", icon: <FaUsers /> },
    { title: "Trips", value: "120", icon: <FaSuitcase /> },
    { title: "Bookings", value: "3450", icon: <FaClipboardList /> },
    { title: "Revenue", value: "$250K", icon: <FaDollarSign /> },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`p-6 rounded-xl shadow-lg flex flex-col items-center justify-center gap-3 transform transition hover:scale-105 ${
            themeName === "dark"
              ? "bg-black/40 border border-gold/30 text-gold"
              : "bg-white/70 border border-[#c9a34a]/30 text-[#3a2c0a] backdrop-blur-sm"
          }`}
        >
          <div className="text-3xl">{card.icon}</div>
          <h4 className="text-lg font-bold">{card.title}</h4>
          <p className="text-2xl font-extrabold">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
