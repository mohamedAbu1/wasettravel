"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  FaGooglePlay,
  FaApple,
  FaTripadvisor,
  FaBlogger,
} from "react-icons/fa";
import { MdTravelExplore } from "react-icons/md";
import { useTheme } from "@/context/ThemeContext";

const SocialMediaIcons = () => {
  const { theme } = useTheme();

  const socialLinks = [
    { Icon: FaGooglePlay, link: "https://play.google.com", label: "Download on Google Play" },
    { Icon: FaApple, link: "https://apple.com", label: "Visit Apple website" },
    {
      Icon: FaTripadvisor,
      link: "https://www.tripadvisor.com/UserReviewEdit-g294205-d34511536-Waset_Travel-Luxor_Nile_River_Valley.html",
      label: "Write a review on Tripadvisor"
    },
    { Icon: MdTravelExplore, link: "https://supplier.viator.com", label: "Explore on Viator" },
    { Icon: FaBlogger, link: "https://wasettravel.blogspot.com", label: "Read our Blog on Blogger" },
  ];

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="hidden absolute right-10 top-1/2 -translate-y-1/2 lg:flex flex-col gap-6 z-30"
    >
      {socialLinks.map(({ Icon, link, label }, i) => (
        <motion.a
          whileHover={{ scale: 1.2, rotate: 5 }}
          key={i}
          aria-label={label} // ✅ اسم واضح لكل رابط
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className={`p-3 rounded-full ${theme.card} ${theme.shadow}`}
        >
          <Icon size={22} className={theme.icon} />
        </motion.a>
      ))}
    </motion.div>
  );
};

export default SocialMediaIcons;
