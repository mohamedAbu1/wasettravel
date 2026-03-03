/* eslint-disable react-hooks/purity */
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";

export default function TripHeader({ trip, lang }) {
  const { themeName } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);

  // ✅ تغيير تلقائي كل 3 ثواني
  useEffect(() => {
    if (!trip?.gallery_images || trip.gallery_images.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) =>
        prevIndex === trip.gallery_images.length - 1 ? 0 : prevIndex + 1,
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [trip?.gallery_images?.length]);

  if (!trip?.gallery_images || trip.gallery_images.length === 0) {
    return (
      <div className="text-center py-10">
        No photos are available for this trip.
      </div>
    );
  }

  // ✅ قائمة المعابد والمقابر مع روابط ويكيبيديا
  const sites = [
    { name: "Karnak Temple", url: "https://en.wikipedia.org/wiki/Karnak" },
    { name: "Luxor Temple", url: "https://en.wikipedia.org/wiki/Luxor_Temple" },
    { name: "Hatshepsut", url: "https://en.wikipedia.org/wiki/Mortuary_Temple_of_Hatshepsut" },
    { name: "Medinet Habu", url: "https://en.wikipedia.org/wiki/Medinet_Habu_(temple)" },
    { name: "Seti I", url: "https://en.wikipedia.org/wiki/Temple_of_Seti_I" },
    { name: "Dendera", url: "https://en.wikipedia.org/wiki/Dendera_Temple_complex" },
    { name: "Kom Ombo", url: "https://en.wikipedia.org/wiki/Temple_of_Kom_Ombo" },
    { name: "Edfu", url: "https://en.wikipedia.org/wiki/Temple_of_Edfu" },
    { name: "Philae Temple", url: "https://en.wikipedia.org/wiki/Philae" },
    { name: "Valley of the Kings", url: "https://en.wikipedia.org/wiki/Valley_of_the_Kings" },
    { name: "Valley of the Queens", url: "https://en.wikipedia.org/wiki/Valley_of_the_Queens" },
    { name: "Tomb of Tutankhamun", url: "https://en.wikipedia.org/wiki/Tutankhamun%27s_tomb" },
    { name: "Tomb of Seti I", url: "https://en.wikipedia.org/wiki/Tomb_of_Seti_I" },
    { name: "Tomb of Ramses VI", url: "https://en.wikipedia.org/wiki/Tomb_of_Ramesses_VI" },
    { name: "Tomb of Nefertari", url: "https://en.wikipedia.org/wiki/Tomb_of_Nefertari" },
    { name: "Temple of Horus", url: "https://en.wikipedia.org/wiki/Temple_of_Horus" },
    { name: "Abydos", url: "https://en.wikipedia.org/wiki/Abydos" },
  ];

  // ✅ دالة لتحديد الأسماء وتحويلها لرابط
  const highlightSites = (text) => {
    if (!text) return "";
    let updatedText = text;
    sites.forEach((site) => {
      const regex = new RegExp(site.name, "gi");
      updatedText = updatedText.replace(
        regex,
        `<a href="${site.url}" target="_blank" rel="noopener noreferrer"
          style="color:#c9a34a; font-weight:bold; text-decoration:none;">
          ${site.name}
        </a>`
      );
    });
    return updatedText;
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`w-full p-6 rounded-xl shadow-lg transition ${
        themeName === "dark"
          ? "bg-black/40 text-gold"
          : "bg-white/90 text-[#3a2c0a]"
      }`}
    >
      {/* العنوان */}
      <motion.h1
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`text-3xl font-extrabold mb-6 border-b pb-3 ${
          themeName === "dark" ? "border-gold/50" : "border-[#c9a34a]/50"
        }`}
      >
        {trip.title?.[lang] || trip.title?.en}
      </motion.h1>

      {/* ✅ الصورة الرئيسية */}
      <motion.div
        key={activeIndex}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="overflow-hidden rounded-lg shadow-md mb-6 relative h-[500px]"
      >
        <Image
          src={trip.gallery_images[activeIndex].url || "/default.jpg"}
          alt={
            trip.gallery_images[activeIndex].name?.[lang] ||
            trip.gallery_images[activeIndex].name?.en ||
            "Trip image"
          }
          fill
          className="object-cover w-full h-[500px] transform hover:scale-105 transition duration-500 rounded-lg"
          priority
        />

        {trip.gallery_images[activeIndex].name && (
          <div className="absolute bottom-4 left-4 text-xl font-bold px-4 py-2 rounded bg-black/50 text-white">
            {trip.gallery_images[activeIndex].name?.[lang] ||
              trip.gallery_images[activeIndex].name?.en}
          </div>
        )}
      </motion.div>

      {/* ✅ الصور الجانبية المصغرة */}
      <div className="flex gap-4 overflow-x-auto">
        {trip.gallery_images.map((img, index) => (
          <div
            key={index}
            className={`relative w-[150px] h-[100px] rounded-lg cursor-pointer border-2`}
            style={{
              borderColor:
                index === activeIndex
                  ? themeName === "dark"
                    ? "#FFD700"
                    : "#c9a34a"
                  : "transparent",
            }}
            onClick={() => setActiveIndex(index)}
          >
            <Image
              src={img.url || "/default.jpg"}
              alt={img.name?.[lang] || img.name?.en || `Thumbnail ${index}`}
              fill
              className="object-cover rounded-lg"
            />

            {img.name && (
              <div className="absolute bottom-2 left-2 text-xs font-bold bg-black/50 text-white px-2 py-1 rounded">
                {img.name?.[lang] || img.name?.en}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ✅ الوصف مع تمييز المعابد والمقابر */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="leading-relaxed text-lg mt-6"
        dangerouslySetInnerHTML={{
          __html: highlightSites(trip.description?.[lang] || trip.description?.en),
        }}
      />

      <style jsx>{`
        a:hover {
          text-decoration: underline;
          color: #eab308;
        }
      `}</style>
    </motion.section>
  );
}
