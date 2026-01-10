import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { FaEdit, FaTrash } from "react-icons/fa";
import EgyptianBackground from "@/components/trips/EgyptianBackground";

export default function TripsList() {
  const { themeName } = useTheme();

  const trips = [
    { title: "Nile Cruise", destination: "Cairo", price: "$500" },
    { title: "Desert Safari", destination: "Siwa", price: "$300" },
    { title: "Red Sea Diving", destination: "Hurghada", price: "$700" },
  ];

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
        All Trips
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
            <th className="p-3">Title</th>
            <th className="p-3">Destination</th>
            <th className="p-3">Price</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip, i) => (
            <tr
              key={i}
              className={`transition hover:scale-[1.01] ${
                themeName === "dark"
                  ? "hover:bg-gold/10"
                  : "hover:bg-[#fdf6e3]/50"
              }`}
            >
              <td className="p-3">{trip.title}</td>
              <td className="p-3">{trip.destination}</td>
              <td className="p-3 font-semibold">{trip.price}</td>
              <td className="p-3 flex gap-3">
                <button
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-bold transition ${
                    themeName === "dark"
                      ? "bg-[#c9a34a] text-black hover:bg-yellow-500"
                      : "bg-[#c9a34a] text-white hover:bg-[#b5892e]"
                  }`}
                >
                  <FaEdit /> Edit
                </button>
                <button
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-bold transition ${
                    themeName === "dark"
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                >
                  <FaTrash /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
