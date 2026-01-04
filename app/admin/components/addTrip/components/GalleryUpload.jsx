import React from "react";
import { FaImage, FaTrash } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";

export default function GalleryUpload({ galleryImages, setGalleryImages }) {
  const { themeName } = useTheme();

  const handleGalleryImages = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: "",
    }));
    setGalleryImages([...galleryImages, ...newImages]);
  };

  const updateImageName = (index, value) => {
    const updated = [...galleryImages];
    updated[index].name = value;
    setGalleryImages(updated);
  };

  const removeImage = (index) => {
    const updated = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(updated);
  };

  return (
    <div>
      <h3
        className={`text-xl font-bold mb-3 ${
          themeName === "dark" ? "text-gold" : "text-[#3a2c0a]"
        }`}
      >
        Gallery Images
      </h3>

      {/* زر إضافة الصور */}
      <label
        className={`flex items-center gap-3 cursor-pointer px-4 py-2 rounded-lg font-bold w-fit ${
          themeName === "dark"
            ? "bg-[#c9a34a] text-black hover:bg-yellow-500"
            : "bg-[#c9a34a] text-white hover:bg-[#b5892e]"
        }`}
      >
        <FaImage /> Add Gallery Images
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleGalleryImages}
          className="hidden"
        />
      </label>

      {/* عرض الصور */}
      {galleryImages.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mt-3">
          {galleryImages.map((img, i) => (
            <div key={i} className="flex flex-col items-center">
              <Image
                src={img.url}
                alt={`Gallery ${i}`}
                className="w-20 h-20 object-cover rounded-lg shadow"
              />
              <input
                type="text"
                value={img.name}
                onChange={(e) => updateImageName(i, e.target.value)}
                placeholder="Image Name"
                className={`mt-2 w-full p-2 rounded-lg border text-sm outline-none ${
                  themeName === "dark"
                    ? "bg-[#0f0f0f] border-gold/30 text-white"
                    : "bg-[#fdf6e3] border-[#c9a34a]/40 text-[#3a2c0a]"
                }`}
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className={`mt-1 flex items-center gap-1 text-sm font-bold px-2 py-1 rounded ${
                  themeName === "dark"
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                <FaTrash /> Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
