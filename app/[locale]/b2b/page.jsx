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

// ✅ Lazy load components غير حرجة
const TestimonialsSection = dynamic(() => import("@/components/b2b/TestimonialsSection"), { ssr: false });
const ChatWidget = dynamic(() => import("@/components/layout/ChatWidget"), { ssr: false });

const B2bPage = () => {
  const { theme, themeName } = useTheme();

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
            blurDataURL="/iamges/blur-placeholder.jpg"
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
              aria-label="Your Premier Travel Management Partner in Egypt"
              className={`text-3xl md:text-5xl mb-4 ${theme.title}`}
            >
              Your Premier Travel Management Partner in Egypt
            </h1>

            <p
              aria-label="Company introduction text"
              className={`text-sm md:text-lg leading-relaxed mb-6 ${theme.subText}`}
            >
              As a leading destination management company in Egypt, we deliver a
              comprehensive suite of travel services designed to provide your
              clients with a seamless and extraordinary journey. Our core
              capabilities encompass bespoke private guided tours, efficient
              ground transportation, domestic flight logistics, luxury
              accommodations, and exclusive Dahabiya Nile cruises.
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
              aria-label="What we are providing"
              className={`text-3xl mb-4 ${theme.title}`}
            >
              What we are providing
            </h2>
            <p className={theme.subText}>
              We believe that our dedication to quality and our strategic location
              can significantly enhance the travel options you present to your
              customers. Our true forte lies in customizing experiences that
              transcend the ordinary, crafting memories that last a lifetime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { title: "Expertise", desc: "Our team comprises expert Egyptologists, each bringing a wealth of knowledge and passion to every tour." },
              { title: "Professionalism", desc: "We pride ourselves on the professionalism of our drivers and guides, ensuring safety, comfort, and insightful experiences." },
              { title: "Customization", desc: "We specialize in tailoring itineraries to meet the specific desires of your clients." },
              { title: "Experience", desc: "With years of operation, we have honed our ability to cater to both individual travelers and groups." },
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
                We are eager to discuss how we can enrich your offerings and
                delight your customers with unparalleled journeys through Egypt.
                Please feel free to reach out at your earliest convenience to
                initiate a conversation about our potential partnership.
              </p>
              <button aria-label="Contact Waset Travel team" className={theme.buttonSecondary}>
                Contact us
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
                blurDataURL="/iamges/blur-placeholder.jpg"
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
