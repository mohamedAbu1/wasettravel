import React from "react";
import { useTheme } from "@/context/ThemeContext";

export default function DailyItinerary({ itinerary, setItinerary }) {
  const { themeName } = useTheme();

  // ضمان أن القيمة Array
  const safeItinerary = Array.isArray(itinerary) ? itinerary : [];

  const addDay = () => {
    setItinerary([
      ...safeItinerary,
      { day: safeItinerary.length + 1, activities: [{ time: "", activity: "" }] },
    ]);
  };

  const addActivity = (dayIndex) => {
    const next = safeItinerary.map((d, i) =>
      i === dayIndex
        ? {
            ...d,
            activities: Array.isArray(d.activities)
              ? [...d.activities, { time: "", activity: "" }]
              : [{ time: "", activity: "" }],
          }
        : d
    );
    setItinerary(next);
  };

  const updateActivity = (dayIndex, actIndex, field, value) => {
    const next = safeItinerary.map((d, i) => {
      if (i !== dayIndex) return d;
      const acts = Array.isArray(d.activities) ? d.activities : [];
      const updatedActs = acts.map((a, j) =>
        j === actIndex ? { ...a, [field]: value } : a
      );
      return { ...d, activities: updatedActs };
    });
    setItinerary(next);
  };

  return (
    <div>
      <h3
        className={`text-xl font-bold mb-3 ${
          themeName === "dark" ? "text-gold" : "text-[#3a2c0a]"
        }`}
      >
        Daily Itinerary
      </h3>

      {safeItinerary.length === 0 ? (
        <p
          className={`${
            themeName === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          No days yet.
        </p>
      ) : (
        safeItinerary.map((day, dayIndex) => {
          const activities = Array.isArray(day?.activities) ? day.activities : [];

          return (
            <div
              key={dayIndex}
              className={`mb-6 p-4 rounded-lg border ${
                themeName === "dark"
                  ? "bg-[#0f0f0f] border-gold/30 text-white"
                  : "bg-[#fdf6e3] border-[#c9a34a]/40 text-[#3a2c0a]"
              }`}
            >
              <h4 className="font-semibold mb-2">Day {day?.day ?? dayIndex + 1}</h4>

              {activities.map((act, actIndex) => (
                <div key={actIndex} className="flex gap-3 mb-2">
                  <input
                    type="time"
                    value={act?.time ?? ""}
                    onChange={(e) =>
                      updateActivity(dayIndex, actIndex, "time", e.target.value)
                    }
                    className={`p-2 rounded-lg border ${
                      themeName === "dark"
                        ? "bg-[#1a1a1a] border-gold/30 text-white"
                        : "bg-white border-[#c9a34a]/40 text-[#3a2c0a]"
                    }`}
                  />
                  <input
                    type="text"
                    value={act?.activity ?? ""}
                    onChange={(e) =>
                      updateActivity(dayIndex, actIndex, "activity", e.target.value)
                    }
                    placeholder="Activity"
                    className={`flex-1 p-2 rounded-lg border ${
                      themeName === "dark"
                        ? "bg-[#1a1a1a] border-gold/30 text-white"
                        : "bg-white border-[#c9a34a]/40 text-[#3a2c0a]"
                    }`}
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() => addActivity(dayIndex)}
                className={`px-3 py-1 rounded font-bold ${
                  themeName === "dark"
                    ? "bg-[#c9a34a] text-black hover:bg-yellow-500"
                    : "bg-[#c9a34a] text-white hover:bg-[#b5892e]"
                }`}
              >
                + Add Activity
              </button>
            </div>
          );
        })
      )}

      <button
        type="button"
        onClick={addDay}
        className={`px-4 py-2 rounded font-bold ${
          themeName === "dark"
            ? "bg-[#c9a34a] text-black hover:bg-yellow-500"
            : "bg-[#c9a34a] text-white hover:bg-[#b5892e]"
        }`}
      >
        + Add Day
      </button>
    </div>
  );
}
