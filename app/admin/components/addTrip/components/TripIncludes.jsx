import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";

export default function TripIncludes({ tripIncludes, setTripIncludes }) {
  const { themeName } = useTheme();

  const addInclude = () => setTripIncludes([...tripIncludes, ""]);
  const updateInclude = (index, value) => {
    const updated = [...tripIncludes];
    updated[index] = value;
    setTripIncludes(updated);
  };

  return (
    <div>
      <h3
        className={`text-xl font-bold mb-3 ${
          themeName === "dark" ? "text-gold" : "text-[#3a2c0a]"
        }`}
      >
        Trip Includes
      </h3>

      {tripIncludes.map((inc, i) => (
        <div key={i} className="flex items-center gap-3 mb-2">
          <FaCheckCircle
            className={`text-xl ${
              themeName === "dark" ? "text-gold" : "text-[#c9a34a]"
            }`}
          />
          <input
            type="text"
            value={inc}
            onChange={(e) => updateInclude(i, e.target.value)}
            placeholder={`Include item ${i + 1}`}
            className={`flex-1 p-3 rounded-lg border outline-none ${
              themeName === "dark"
                ? "bg-[#0f0f0f] border-gold/30 text-white"
                : "bg-[#fdf6e3] border-[#c9a34a]/40 text-[#3a2c0a]"
            }`}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addInclude}
        className={`px-4 py-2 rounded-lg font-bold mt-2 ${
          themeName === "dark"
            ? "bg-[#c9a34a] text-black hover:bg-yellow-500"
            : "bg-[#c9a34a] text-white hover:bg-[#b5892e]"
        }`}
      >
        + Add Include
      </button>
    </div>
  );
}
