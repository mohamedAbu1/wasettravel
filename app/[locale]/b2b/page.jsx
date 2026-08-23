"use client";
import React from "react";
import { motion } from "framer-motion";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import Header from "@/components/header/Header";
import TestimonialsSection from "@/components/b2b/TestimonialsSection";
import Footer from "@/components/Footer/Footer";
import { useTheme } from "@/context/ThemeContext";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaTiktok  } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
const B2bPage = () => {
  const { theme, themeName } = useTheme(); // استدعاء الثيم
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
    <main className={`${theme.background} ${theme.text}`}>
      {/* Hero Section */}
      <Header />
      <EgyptianBackground />

      <div
        className={`relative h-[850px] bg-cover bg-center flex items-center justify-center text-center ${theme.overlay}`}
        style={{
          backgroundImage:
            "url('/iamges/5fae16c5ab3f1921b620186c04e03b0ec685a8d3b8b40d72cf262f9573ceeb8b.webp')", // ضع هنا مسار الصورة الخلفية
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className={`relative z-10 max-w-3xl px-6 ${theme.text}`}
        >
          <h1 className={`text-3xl md:text-5xl mb-4 ${theme.title}`}>
            Your Premier Travel Management Partner in Egypt
          </h1>

          <p
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
           <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="absolute left-[42%] bottom-0 -translate-y-1/2 flex flex-row gap-6 z-30"
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
      </div>

      {/* What we provide */}
      <section
        className={`py-16 text-center ${theme.background} ${theme.shadow}`}
      >
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className={`text-3xl mb-4 ${theme.title}`}>
            What we are providing
          </h2>
          <p className={theme.subText}>
            We believe that our dedication to quality and our strategic location
            can significantly enhance the travel options you present to your
            customers and our true forte lies in customizing experiences that
            transcend the ordinary, crafting memories that last a lifetime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Expertise */}
          <div className={`flex flex-col items-center ${theme.card} p-6`}>
            <div
              className={`w-12 h-12 flex items-center justify-center mb-4 ${theme.border}`}
            >
              <span className={theme.icon}>✓</span>
            </div>
            <h3 className={`text-lg mb-2 ${theme.heading}`}>Expertise</h3>
            <p className={theme.subText}>
              Our team comprises expert Egyptologists, each bringing a wealth of
              knowledge and passion to every tour.
            </p>
          </div>

          {/* Professionalism */}
          <div className={`flex flex-col items-center ${theme.card} p-6`}>
            <div
              className={`w-12 h-12 flex items-center justify-center mb-4 ${theme.border}`}
            >
              <span className={theme.icon}>✓</span>
            </div>
            <h3 className={`text-lg mb-2 ${theme.heading}`}>Professionalism</h3>
            <p className={theme.subText}>
              We pride ourselves on the professionalism of our drivers and
              guides, ensuring safety, comfort, and insightful experiences.
            </p>
          </div>

          {/* Customization */}
          <div className={`flex flex-col items-center ${theme.card} p-6`}>
            <div
              className={`w-12 h-12 flex items-center justify-center mb-4 ${theme.border}`}
            >
              <span className={theme.icon}>✓</span>
            </div>
            <h3 className={`text-lg mb-2 ${theme.heading}`}>Customization</h3>
            <p className={theme.subText}>
              While our website showcases a selection of standard tours, we
              specialize in tailoring itineraries to meet the specific desires
              of your clients.
            </p>
          </div>

          {/* Experience */}
          <div className={`flex flex-col items-center ${theme.card} p-6`}>
            <div
              className={`w-12 h-12 flex items-center justify-center mb-4 ${theme.border}`}
            >
              <span className={theme.icon}>✓</span>
            </div>
            <h3 className={`text-lg mb-2 ${theme.heading}`}>Experience</h3>
            <p className={theme.subText}>
              With years of operation, we have honed our ability to cater to
              both individual travelers and groups, delivering personalized
              attention and care.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        className={`py-16 px-6 md:px-20 flex flex-col md:flex-row items-center justify-around gap-10 ${theme.background} `}
      >
        <div
          className={`w-2/3 flex items-center justify-center flex-wrap flex-col lg:flex-row ${theme.card} ${theme.shadow}`}
        >
          <div className="md:w-1/3 space-y-4">
            <p className={`text-lg leading-relaxed ${theme.subText}`}>
              We are eager to discuss how we can enrich your offerings and
              delight your customers with unparalleled journeys through Egypt.
              Please feel free to reach out at your earliest convenience to
              initiate a conversation about our potential partnership.
            </p>
            <button className={theme.buttonSecondary}>Contact us</button>
          </div>

          <div className="md:w-1/2 flex justify-center">
            <img
              src="/iamges/WhatsApp Image 2026-08-20 at 5.12.22 PM.jpeg"
              alt="Far & Beyond Travel"
              className="rounded-lg shadow-lg w-full md:w-[400px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <div className="flex items-center justify-center">
        <TestimonialsSection />
      </div>

      <Footer />
    </main>
  );
};

export default B2bPage;
