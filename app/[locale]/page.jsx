import Footer from "@/components/Footer/Footer";
import Header from "@/components/header/Header";
import CarBookingSection from "@/components/home/CarBookingSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import CitiesSection from "@/components/home/CitiesSection";
import HeroSection from "@/components/home/HeroSection";
import OurSection from "@/components/home/OurSection";
import TopTripsSection from "@/components/home/TopTripsSection";
import LoginModal from "@/components/home/components/LoginModal";
import SignUpButton from "@/components/home/components/SignUpButton";
// ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
export default function Home() {
  // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

  return (
    <main
      className={`
        min-h-screen font-sans
       bg-white
        transition-colors duration-300
         overflow-hidden
      `}
    >
      <Header />

      {/* ================= HERO SECTION ================= */}
      <HeroSection />

      {/* ================= CATEGORIES SECTION ================= */}
      <CategoriesSection />

      {/* ================= TOP TRIPS SECTION ================= */}
      <TopTripsSection />

      {/* ================= CITIES SECTION ================= */}
      <CitiesSection />
      <OurSection />
      <CarBookingSection />
      {/* ================= FOOTER ================= */}
      <Footer />

      <SignUpButton />
      <LoginModal />
    </main>
  );
}
