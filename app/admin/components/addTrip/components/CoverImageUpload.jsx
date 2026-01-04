import Image from "next/image";
import React from "react";
import { FaImage, FaTrash } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";

export default function CoverImageUpload({
  coverImage,
  setCoverImage,
  coverName,
  setCoverName,
}) {
  const { themeName } = useTheme();

  const handleCoverImage = (e) => {
    const file = e.target.files[0];
    if (file) setCoverImage(URL.createObjectURL(file));
  };

  const removeCoverImage = () => {
    setCoverImage(null);
    setCoverName("");
  };

  return (
    <div>
      <h3
        className={`text-xl font-bold mb-3 ${
          themeName === "dark" ? "text-gold" : "text-[#3a2c0a]"
        }`}
      >
        Cover Image
      </h3>

      {/* زر اختيار الصورة */}
      <label
        className={`flex items-center gap-3 cursor-pointer px-4 py-2 rounded-lg font-bold w-fit ${
          themeName === "dark"
            ? "bg-[#c9a34a] text-black hover:bg-yellow-500"
            : "bg-[#c9a34a] text-white hover:bg-[#b5892e]"
        }`}
      >
        <FaImage /> Choose Cover Image
        <input
          type="file"
          accept="image/*"
          onChange={handleCoverImage}
          className="hidden"
        />
      </label>

      {/* معاينة الصورة + اسم + زر حذف */}
      {coverImage && (
        <div className="mt-3">
          <Image
            src={coverImage}
            alt="Cover Preview"
            width={128}
            height={128}
            className="w-32 h-32 object-cover rounded-lg shadow"
          />
          <input
            type="text"
            value={coverName}
            onChange={(e) => setCoverName(e.target.value)}
            placeholder="Cover Image Name"
            className={`mt-2 w-full p-2 rounded-lg border text-sm outline-none ${
              themeName === "dark"
                ? "bg-[#0f0f0f] border-gold/30 text-white"
                : "bg-[#fdf6e3] border-[#c9a34a]/40 text-[#3a2c0a]"
            }`}
          />

          {/* زر حذف الصورة */}
          <button
            type="button"
            onClick={removeCoverImage}
            className={`mt-2 flex items-center gap-2 px-3 py-1 rounded-lg font-bold text-sm ${
              themeName === "dark"
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            <FaTrash /> Remove Image
          </button>
        </div>
      )}
    </div>
  );
}
