"use client";
import { motion } from "framer-motion";
import React from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaTiktok } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { siteConfig } from "@/lib/siteConfig";

const LeftSocialIcons = () => {
  const socialLinks = [
    { Icon: FaFacebookF, url: siteConfig.social.facebook, label: "Visit our Facebook page" },
    { Icon: FaInstagram, url: siteConfig.social.instagram, label: "Visit our Instagram page" },
    { Icon: FaWhatsapp, url: siteConfig.whatsapp, label: "Chat with us on WhatsApp" },
    { Icon: MdEmail, url: `mailto:${siteConfig.email}`, label: "Send us an email" },
    { Icon: FaTiktok, url: siteConfig.social.tiktok, label: "Follow us on TikTok" },
  ];

  return (
    <motion.div
      initial={{ y: 8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: .35, delay: 0.15 }}
      className="hero-social-links"
      role="list"
    >
      <span className="hero-social-links__label">Follow our journey</span>
      {socialLinks.map(({ Icon, url, label }, i) => (
        <motion.a
          whileHover={{ scale: 1.2, rotate: -5 }}
          key={i}
          href={url}
          aria-label={label} // ✅ اسم واضح لكل رابط
          role="listitem"
          target="_blank"
          rel="noopener noreferrer"
          className="hero-social-links__icon"
        >
          <Icon aria-hidden="true" />
        </motion.a>
      ))}
    </motion.div>
  );
};

export default LeftSocialIcons;
