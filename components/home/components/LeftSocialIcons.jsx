"use client";
import { motion } from "framer-motion";
import React from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaTiktok  } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { MdEmail } from "react-icons/md";
// ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
const LeftSocialIcons = () => {
  // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  const { theme } = useTheme();
  // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  const socialLinks = [
    { Icon: FaFacebookF, url: "https://www.facebook.com/share/1BTkjPD5Sd/" },
    {
      Icon: FaInstagram,
      url: "https://www.instagram.com/kader.mohameda?igsh=MXZkd3VvOTNhanJoZA==",
    },
    { Icon: FaWhatsapp, url: "https://wa.me/qr/WIFIQJUBO2PJH1" },
    { Icon: MdEmail, url: "mailto:yourmail@example.com" },
    {
      Icon: FaTiktok,
      url: "https://www.tiktok.com/@mohamedakader25?_r=1&_t=ZS-97OkNILIAZm",
    },
    
  ];

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 0.7 }}
      className="absolute left-[30px] bottom-0 lg:top-[55%] -translate-y-1/2 flex flex-row lg:flex-col gap-6 z-30"
    >
      {socialLinks.map(({ Icon, url }, i) => (
        <motion.a
          whileHover={{ scale: 1.2, rotate: -5 }}
          key={i}
          href={url}
          target="_blank" // يفتح الرابط في تبويب جديد
          rel="noopener noreferrer"
          className={`p-3 rounded-full ${theme.card} ${theme.shadow}`}
        >
          <Icon size={22} className={theme.icon} />
        </motion.a>
      ))}
    </motion.div>
  );
};

export default LeftSocialIcons;
