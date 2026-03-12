"use client";
import { FaChild, FaDog, FaUsers, FaCat, FaUserTie, FaLanguage } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";

export default function AdditionalDetails({
  hasChildren,
  setHasChildren,
  childrenCount,
  setChildrenCount,
  hasPets,
  setHasPets,
  pets,
  setPets,
  groupSize,
  setGroupSize,
  hasGuide,
  setHasGuide,
  guideLanguages,
  setGuideLanguages,
}) {
  const { themeName } = useTheme();

  // ✅ قائمة اللغات المتاحة
  const availableLanguages = ["English", "Chinese", "French", "German", "Spanish", "Italian"];

  // ✅ دالة اختيار اللغة مع حد أقصى لغتين
  const toggleLanguage = (lang) => {
    if (guideLanguages.includes(lang)) {
      setGuideLanguages(guideLanguages.filter((l) => l !== lang));
    } else {
      if (guideLanguages.length < 2) {
        setGuideLanguages([...guideLanguages, lang]);
      } else {
        alert("❌ You can select only up to 2 languages.");
      }
    }
  };

  return (
    <div className="mb-6 border-b border-gray-300/30 pb-4">
      <h3
        className={`text-lg font-semibold mb-3 ${
          themeName === "dark" ? "text-[#c9a34a]" : "text-[#11111194]"
        }`}
      >
        Additional Details
      </h3>

      {/* الأطفال */}
      <label className="flex items-center gap-2 mb-2 cursor-pointer">
        <input
          type="checkbox"
          checked={hasChildren}
          onChange={() => setHasChildren(!hasChildren)}
          className="accent-[#c9a34a]"
        />
        <FaChild className="text-[#c9a34a]" /> <span>Traveling with children</span>
      </label>

      {hasChildren && (
        <div className="ml-6 mb-3 flex items-center gap-2">
          <label className="font-medium">Number of children:</label>
          <input
            type="number"
            min="1"
            value={childrenCount}
            onChange={(e) => setChildrenCount(e.target.value)}
            className="w-20 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* الحيوانات */}
      <label className="flex items-center gap-2 mb-2 cursor-pointer">
        <input
          type="checkbox"
          checked={hasPets}
          onChange={() => setHasPets(!hasPets)}
          className="accent-[#c9a34a]"
        />
        <FaDog className="text-[#c9a34a]" /> <span>Traveling with pets</span>
      </label>

      {hasPets && (
        <div className="ml-6 mb-3">
          <label className="font-medium block mb-2">Select pets:</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={pets.includes("cat")}
                onChange={() =>
                  setPets(
                    pets.includes("cat")
                      ? pets.filter((p) => p !== "cat")
                      : [...pets, "cat"]
                  )
                }
              />
              <FaCat className="text-[#c9a34a]" /> Cat
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={pets.includes("dog")}
                onChange={() =>
                  setPets(
                    pets.includes("dog")
                      ? pets.filter((p) => p !== "dog")
                      : [...pets, "dog"]
                  )
                }
              />
              <FaDog className="text-[#c9a34a]" /> Dog
            </label>
          </div>
        </div>
      )}

      {/* المرشد السياحي */}
      <label className="flex items-center gap-2 mb-2 cursor-pointer">
        <input
          type="checkbox"
          checked={hasGuide}
          onChange={() => setHasGuide(!hasGuide)}
          className="accent-[#c9a34a]"
        />
        <FaUserTie className="text-[#c9a34a]" /> <span>Tour Guide</span>
      </label>

      {hasGuide && (
        <div className="ml-6 mb-3">
          <label className="font-medium block mb-2 flex items-center gap-2">
            <FaLanguage className="text-[#c9a34a]" /> Select up to 2 languages:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {availableLanguages.map((lang) => (
              <label key={lang} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={guideLanguages.includes(lang)}
                  onChange={() => toggleLanguage(lang)}
                />
                {lang}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* حجم المجموعة */}
      <div className="mt-3 flex items-center gap-2">
        <FaUsers className="text-[#c9a34a]" />
        <label className="block mb-1 font-medium">Group Size</label>
        <input
          type="number"
          min="1"
          value={groupSize}
          onChange={(e) => setGroupSize(e.target.value)}
          className="w-20 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
