/* eslint-disable react-hooks/purity */
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { FaStar } from "react-icons/fa";

export default function TripsGrid({ trips, cardStyle = "vertical" }) {
  const { themeName } = useTheme();

  const getRandomStars = () => Math.floor(Math.random() * 3) + 3; // 3 → 5

  return (
    <div
      className={`flex-1 ${
        cardStyle === "vertical"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "grid grid-cols-1 md:grid-cols-2 gap-6"
      }`}
    >
      {trips.map((trip, i) => {
        const stars = getRandomStars();
        const reviews = trip.reviews || Math.floor(Math.random() * 200) + 20;

        return (
          <div
            key={i}
            className={`h-[100%] relative rounded-xl shadow-lg overflow-hidden transform transition 
              ${themeName === "dark" ? "border border-gold/30" : "border border-[#c9a34a]/30"} 
              ${cardStyle === "horizontal" ? "h-48 flex animate-slideIn" : "h-64 animate-fadeScale"}`}
            style={{
              backgroundImage: `url(${trip.img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-t ${
                themeName === "dark"
                  ? "from-black/80 via-black/40 to-transparent"
                  : "from-[#3a2c0a]/70 via-[#3a2c0a]/40 to-transparent"
              }`}
            />

            {/* محتوى الكارد */}
            <div
              className={`absolute bottom-0 p-4 w-full flex flex-col gap-2 text-white ${
                cardStyle === "horizontal" ? "justify-center" : ""
              }`}
            >
              <h4
                className={`text-lg font-bold ${
                  themeName === "dark" ? "text-gold" : "text-white"
                }`}
              >
                {trip.title}
              </h4>
              <p className="text-sm opacity-90">
                {trip.city} • {trip.category}
              </p>

              <p className="text-md font-semibold">
                <span
                  className={`px-2 py-1 rounded ${
                    themeName === "dark"
                      ? "bg-[#c9a34a] text-black"
                      : "bg-[#c9a34a] text-white"
                  }`}
                >
                  ${trip.price}
                </span>
              </p>

              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, idx) => (
                  <FaStar
                    key={idx}
                    className={`${
                      idx < stars ? "text-yellow-400" : "text-gray-500 opacity-50"
                    }`}
                  />
                ))}
                <span className="text-sm opacity-80">({reviews} reviews)</span>
              </div>

              <button
                className={`mt-2 px-4 py-2 rounded-lg font-bold transition ${
                  themeName === "dark"
                    ? "bg-[#c9a34a] text-black hover:bg-yellow-500"
                    : "bg-[#c9a34a] text-white hover:bg-[#b5892e]"
                }`}
              >
                Book Now
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
