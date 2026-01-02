"use client";
import { motion } from "framer-motion";
import React from "react";
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { MdEmail } from "react-icons/md";
// ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
const LeftSocialIcons = () => {
  // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  const { theme } = useTheme();
  // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 0.7 }}
      className="absolute left-10 bottom-0 md:top-[55%] -translate-y-1/2 flex flex-row md:flex-col gap-6 z-30"
    >
      {[FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp, MdEmail].map(
        (Icon, i) => (
          <motion.a
            whileHover={{ scale: 1.2, rotate: -5 }}
            key={i}
            href="#"
            className={`p-3 rounded-full ${theme.card} ${theme.shadow}`}
          >
            <Icon size={22} className={theme.icon} />
          </motion.a>
        )
      )}
    </motion.div>
  );
};

export default LeftSocialIcons;
