import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { FaCity, FaTags, FaDollarSign } from "react-icons/fa";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import { useTrip } from "@/context/TripContext";

export default function TripClassification() {
  const { themeName } = useTheme();
  const { cities: allCities, categories: allCategories, loading } = useCitiesCategories();
  const { tripData, setTripData } = useTrip();

  const baseBoxStyle = `flex items-center gap-2 p-2 rounded-lg cursor-pointer transition`;
  const lightBoxStyle = `bg-white/80 border border-[#c9a34a]/40 text-gray-800 hover:bg-[#fdf6e3]`;
  const darkBoxStyle = `bg-black/40 border border-gold/40 text-gold hover:bg-[#1a1a1a]`;

  // ✅ دالة لتبديل الاختيار
  const toggleSelection = (list, key, value) => {
    const updated = list.includes(value)
      ? list.filter((item) => item !== value)
      : [...list, value];
    setTripData({ ...tripData, [key]: updated });
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading cities & categories...</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
      {/* الكاتجري */}
      <div className="flex flex-col gap-2">
        <label className={`flex items-center gap-2 font-bold ${themeName === "dark" ? "text-gold" : "text-gray-700"}`}>
          <FaTags /> Categories
        </label>
        {allCategories.map((cat) => (
          <div
            key={cat.id ?? cat.name}
            className={`${baseBoxStyle} ${themeName === "dark" ? darkBoxStyle : lightBoxStyle}`}
            onClick={() => toggleSelection(tripData.categories, "categories", cat.name)}
          >
            <input
              type="checkbox"
              checked={tripData.categories.includes(cat.name)}
              onChange={() => toggleSelection(tripData.categories, "categories", cat.name)}
            />
            <span>{cat.name}</span>
          </div>
        ))}
      </div>

      {/* المدن */}
      <div className="flex flex-col gap-2">
        <label className={`flex items-center gap-2 font-bold ${themeName === "dark" ? "text-gold" : "text-gray-700"}`}>
          <FaCity /> Cities
        </label>
        {allCities.map((city) => (
          <div
            key={city.id ?? city.name}
            className={`${baseBoxStyle} ${themeName === "dark" ? darkBoxStyle : lightBoxStyle}`}
            onClick={() => toggleSelection(tripData.cities, "cities", city.name)}
          >
            <input
              type="checkbox"
              checked={tripData.cities.includes(city.name)}
              onChange={() => toggleSelection(tripData.cities, "cities", city.name)}
            />
            <span>{city.name}</span>
          </div>
        ))}
      </div>

      {/* الفئة السعرية */}
      <div className="flex flex-col gap-2">
        <label className={`flex items-center gap-2 font-bold ${themeName === "dark" ? "text-gold" : "text-gray-700"}`}>
          <FaDollarSign /> Price Level
        </label>
        <select
          value={tripData.priceLevel}
          onChange={(e) => setTripData({ ...tripData, priceLevel: e.target.value })}
          className={`w-full p-3 rounded-lg font-semibold transition focus:outline-none focus:ring-2 ${
            themeName === "dark"
              ? "bg-black/40 border border-gold/40 text-gold focus:ring-gold"
              : "bg-white/80 border border-[#c9a34a]/40 text-gray-800 focus:ring-[#c9a34a]"
          }`}
        >
          <option value="">Select Price Level</option>
          <option value="Economy">Economy</option>
          <option value="Standard">Standard</option>
          <option value="Luxury">Luxury</option>
        </select>
      </div>
    </div>
  );
}
