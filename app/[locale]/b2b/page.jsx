"use client";
import React from "react";
import { motion } from "framer-motion";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer/Footer";
import { useTheme } from "@/context/ThemeContext";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaTiktok } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Image from "next/image";
import dynamic from "next/dynamic";
import SeoHead from "@/components/layout/SeoHead";
import { useTranslation } from "react-i18next";

// ✅ Lazy load components غير حرجة
const TestimonialsSection = dynamic(() => import("@/components/b2b/TestimonialsSection"), { ssr: false });
const ChatWidget = dynamic(() => import("@/components/layout/ChatWidget"), { ssr: false });

const B2bPage = () => {
  const { theme, themeName } = useTheme();
  const { t } = useTranslation("b2b");

  const socialLinks = [
    { Icon: FaFacebookF, url: "https://www.facebook.com/share/1BTkjPD5Sd/", label: "Visit our Facebook page" },
    { Icon: FaInstagram, url: "https://www.instagram.com/kader.mohameda?igsh=MXZkd3VvOTNhanJoZA==", label: "Visit our Instagram page" },
    { Icon: FaWhatsapp, url: "https://wa.me/qr/WIFIQJUBO2PJH1", label: "Chat with us on WhatsApp" },
    { Icon: MdEmail, url: "mailto:yourmail@example.com", label: "Send us an email" },
    { Icon: FaTiktok, url: "https://www.tiktok.com/@mohamedakader25?_r=1&_t=ZS-97OkNILIAZm", label: "Follow us on TikTok" },
  ];

  return (
    <>
      <SeoHead
        title="B2B Travel Management Partner in Egypt"
        description="Discover Waset Travel B2B services: guided tours, transportation, accommodations, and Nile cruises tailored for your clients."
        image="/cover.jpg"
      />

      <main className={`${theme.background} ${theme.text}`}>
        {/* Hero Section */}
        <Header />
        <EgyptianBackground />

        <div
          className={`relative h-[850px] bg-cover bg-center flex items-center justify-center text-center ${theme.overlay}`}
        >
          <Image
            src="/iamges/5fae16c5ab3f1921b620186c04e03b0ec685a8d3b8b40d72cf262f9573ceeb8b.webp"
            alt="Egyptian travel background"
            fill
            quality={75}
            sizes="100vw"
            priority
            placeholder="blur"
            blurDataURL="/HomePageImage/apple-touch-icon.png"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className={`relative z-10 max-w-3xl px-6 ${theme.text}`}
          >
            <h1
              role="heading"
              aria-level={1}
              aria-label={t("title")}
              className={`text-3xl md:text-5xl mb-4 ${theme.title}`}
            >
              {t("title")}
            </h1>

            <p
              aria-label={t("intro")}
              className={`text-sm md:text-lg leading-relaxed mb-6 ${theme.subText}`}
            >
              {t("intro")}
            </p>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="absolute left-[42%] bottom-0 -translate-y-1/2 flex flex-row gap-6 z-30"
          >
            {socialLinks.map(({ Icon, url, label }, i) => (
              <motion.a
                whileHover={{ scale: 1.2, rotate: -5 }}
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`p-3 rounded-full ${theme.card} ${theme.shadow}`}
              >
                <Icon size={22} className={theme.icon} />
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* What we provide */}
        <section className={`py-16 text-center ${theme.background} ${theme.shadow}`}>
          <div className="max-w-4xl mx-auto mb-12">
            <h2
              role="heading"
              aria-level={2}
              aria-label={t("whatWeProvide")}
              className={`text-3xl mb-4 ${theme.title}`}
            >
              {t("whatWeProvide")}
            </h2>
            <p className={theme.subText}>
              {t("provideText")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {[
              { title: t("expertise"), desc: t("expertiseText") },
              { title: t("professionalism"), desc: t("professionalismText") },
              { title: t("customization"), desc: t("customizationText") },
              { title: t("experience"), desc: t("experienceText") },
            ].map((item, idx) => (
              <div key={idx} className={`flex flex-col items-center ${theme.card} p-6`}>
                <div className={`w-12 h-12 flex items-center justify-center mb-4 ${theme.border}`}>
                  <span className={theme.icon}>✓</span>
                </div>
                <h3
                  role="heading"
                  aria-level={3}
                  aria-label={item.title}
                  className={`text-lg mb-2 ${theme.heading}`}
                >
                  {item.title}
                </h3>
                <p className={theme.subText}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className={`py-16 px-6 md:px-20 flex flex-col md:flex-row items-center justify-around gap-10 ${theme.background}`}>
          <div className={`w-2/3 flex items-center justify-center flex-wrap flex-col lg:flex-row ${theme.card} ${theme.shadow}`}>
            <div className="md:w-1/3 space-y-4">
              <p className={`text-lg leading-relaxed ${theme.subText}`}>
                {t("contactText")}
              </p>
              <button aria-label="Contact Waset Travel team" className={theme.buttonSecondary}>
                {t("contactUs")}
              </button>
            </div>

            <div className="md:w-1/2 flex justify-center">
              <Image
                src="/iamges/WhatsApp Image 2026-08-20 at 5.12.22 PM.jpeg"
                alt="Waset Travel team discussing partnership opportunities"
                width={400}
                height={300}
                quality={75}
                sizes="(max-width: 768px) 100vw, 400px"
                loading="lazy"
                placeholder="blur"
                blurDataURL="/HomePageImage/apple-touch-icon.png"
                className="rounded-lg shadow-lg object-cover"
              />
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <div className="flex items-center justify-center">
          <TestimonialsSection />
        </div>

        <Footer />
        <ChatWidget />
      </main>
    </>
  );
};

export default B2bPage;
