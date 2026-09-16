"use client";
import { motion } from "framer-motion";
import React from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaTiktok } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const LeftSocialIcons = () => {
  const socialLinks = [
    { Icon: FaFacebookF, url: "https://www.facebook.com/share/1BTkjPD5Sd/", label: "Visit our Facebook page" },
    { Icon: FaInstagram, url: "https://www.instagram.com/kader.mohameda?igsh=MXZkd3VvOTNhanJoZA==", label: "Visit our Instagram page" },
    { Icon: FaWhatsapp, url: "https://wa.me/201091126069", label: "Chat with us on WhatsApp" },
    { Icon: MdEmail, url: "mailto:wasettraveleg@gmail.com", label: "Send us an email" },
    { Icon: FaTiktok, url: "https://www.tiktok.com/@mohamedakader25?_r=1&_t=ZS-97OkNILIAZm", label: "Follow us on TikTok" },
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
