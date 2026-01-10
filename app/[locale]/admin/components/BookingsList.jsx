import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import EgyptianBackground from "@/components/trips/EgyptianBackground";

export default function BookingsList() {
  const { themeName } = useTheme();

  const bookings = [
    {
      user: "Sara",
      trip: "Pyramids Tour",
      date: "2026-01-05",
      status: "Confirmed",
    },
    {
      user: "Ahmed",
      trip: "Nile Cruise",
      date: "2026-02-12",
      status: "Pending",
    },
    {
      user: "Omar",
      trip: "Desert Safari",
      date: "2026-03-20",
      status: "Cancelled",
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "Confirmed":
        return <FaCheckCircle className="text-green-500" />;
      case "Pending":
        return <FaTimesCircle className="text-yellow-500" />;
      case "Cancelled":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`rounded-xl shadow-lg p-6 ${
        themeName === "dark"
          ? "bg-black/40 border border-gold/30 text-white"
          : "bg-white/70 border border-[#c9a34a]/30 text-[#3a2c0a] backdrop-blur-sm"
      }`}
    >
      <EgyptianBackground />

      <h2
        className={`text-2xl font-bold mb-4 ${
          themeName === "dark"
            ? "text-gold"
            : "bg-gradient-to-r from-[#c9a34a] to-[#eab308] bg-clip-text text-transparent"
        }`}
      >
        Bookings
      </h2>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr
            className={`${
              themeName === "dark"
                ? "bg-gold/20 text-gold"
                : "bg-[#fdf6e3] text-[#3a2c0a]"
            }`}
          >
            <th className="p-3">User</th>
            <th className="p-3">Trip</th>
            <th className="p-3">Date</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, i) => (
            <tr
              key={i}
              className={`transition hover:scale-[1.01] ${
                themeName === "dark"
                  ? "hover:bg-gold/10"
                  : "hover:bg-[#fdf6e3]/50"
              }`}
            >
              <td className="p-3">{booking.user}</td>
              <td className="p-3">{booking.trip}</td>
              <td className="p-3">{booking.date}</td>
              <td className="p-3 flex items-center gap-2">
                {getStatusIcon(booking.status)} {booking.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
