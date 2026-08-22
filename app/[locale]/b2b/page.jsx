import React from "react";
import { motion } from "framer-motion";

const B2bPage = () => {
  return (
    <div
      className="relative h-screen bg-cover bg-center flex items-center justify-center text-center"
      style={{
        backgroundImage:
          "url('/images/egypt-temple-bg.jpg')", // ضع هنا مسار الصورة الخلفية
      }}
    >
      {/* طبقة شفافة فوق الخلفية */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* المحتوى */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 max-w-2xl px-6 text-white"
      >
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Your Trusted Travel Partner in Egypt
        </h1>

        <p className="text-sm md:text-lg leading-relaxed mb-6 text-gray-200">
          As a dedicated ground operator in Egypt, we are equipped to manage a
          comprehensive array of travel services, ensuring a seamless and
          enriching experience for your clients. Our offerings include
          meticulously planned private guided tours, convenient transportation
          solutions, domestic flight arrangements, luxurious hotel
          accommodations, and enchanting Dahabiya Nile cruises, among others.
        </p>

        {/* زر احترافي مع تأثير */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-green-400 to-teal-500 text-white font-semibold shadow-lg hover:shadow-xl transition"
        >
          Contact us
        </motion.button>
      </motion.div>
    </div>
  );
};

export default B2bPage;
