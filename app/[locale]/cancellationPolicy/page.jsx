"use client";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer/Footer";
import HeroSection from "@/components/cancellationPolicy/HeroSection";
import CancellationPolicyContent from "@/components/cancellationPolicy/CancellationPolicyContent";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import SeoHead from "@/components/layout/SeoHead";

// ✅ Lazy load components غير حرجة
const ChatWidget = dynamic(() => import("@/components/layout/ChatWidget"), { ssr: false });
const LoginModal = dynamic(() => import("@/components/home/components/LoginModal"), { ssr: false });
const SignUpButton = dynamic(() => import("@/components/home/components/SignUpButton"), { ssr: false });

const CancellationPolicyPage = () => {
  const { themeName, theme } = useTheme();
  const { userData } = useAuth();

  const symbols = [
    "𓂀","𓋹","𓆣","𓇼","𓇯","𓏏","𓎛","𓊽",
    "𓃾","𓅓","𓈇","𓉐","𓊹","𓌙","𓍿","𓎟",
  ];

  return (
    <>
      <SeoHead
        title="Cancellation Policy - Waset Travel"
        description="Read Waset Travel's cancellation policy to understand terms, conditions, and refund options for your bookings."
        image="/cover.jpg"
      />

      <main
        className={`min-h-screen ${theme.background} transition-colors duration-500 font-sans`}
      >
        <EgyptianBackground />

        {/* ✅ خلفية الرموز */}
        <div className="absolute inset-0 flex flex-wrap justify-center items-center opacity-10 pointer-events-none">
          {symbols.map((sym, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.3, y: 0 }}
              transition={{ duration: 1, delay: i * 0.1 }}
              className="text-6xl m-6"
              style={{ color: theme.icon }}
            >
              {sym}
            </motion.span>
          ))}
        </div>

        <Header />
        <HeroSection themeName={themeName} theme={theme} />
        <CancellationPolicyContent theme={theme} />
        <Footer />

        {/* ✅ Lazy loaded components */}
        <SignUpButton />
        <LoginModal />
        {userData && <ChatWidget />}
      </main>
    </>
  );
};

export default CancellationPolicyPage;
