"use client";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";

export default function TripHeader({ trip, lang }) {
  const { themeName } = useTheme();

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}                // يبدأ مخفي ومنزاح لأسفل
      whileInView={{ opacity: 1, y: 0 }}             // يظهر عند دخول الشاشة
      viewport={{ once: true, amount: 0.2 }}         // مرة واحدة فقط، يبدأ عند ظهور 20% من العنصر
      transition={{ duration: 0.8, ease: "easeOut" }} // مدة وسلاسة الحركة
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

      {/* الصورة */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="overflow-hidden rounded-lg shadow-md mb-6"
      >
        <Image
          src={trip.cover_image || "/default.jpg"}
          alt={trip.title?.[lang] || "Trip image"}
          width={800}
          height={500}
          className="object-cover w-full h-[400px] transform hover:scale-105 transition duration-500"
        />
      </motion.div>

      {/* الوصف */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="leading-relaxed text-lg"
      >
        {trip.description?.[lang] || trip.description?.en}
      </motion.p>
    </motion.section>
  );
}
