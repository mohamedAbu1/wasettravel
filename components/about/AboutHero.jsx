"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import DividerWithIcon from "../layout/DividerWithIcon";

export default function AboutHero() {
  const { themeName } = useTheme();
  const { t } = useTranslation("about");

  return (
    <section className="relative z-10 py-20 px-6 mt-9">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-5"
        >
          <p
            className={`uppercase tracking-widest text-sm ${themeName === "dark" ? "text-white/60" : "text-[#6b4f1d]"}`}
          >
            {t("AboutWasetTravel")}
          </p>
          <DividerWithIcon />
          <h1
            className={`text-4xl lg:text-5xl font-extrabold leading-tight ${themeName === "dark" ? "text-gold" : "bg-gradient-to-r from-[#c9a34a] to-[#eab308] bg-clip-text text-transparent"}`}
          >
            {t("h1")}
          </h1>
          <DividerWithIcon />
          <p
            className={`${themeName === "dark" ? "text-white/80" : "text-[#5c4520]"} text-lg`}
          >
            About Waset Travel Welcome to Waset Travel, your trusted gateway to
            discovering the timeless wonders of Egypt. Our name, Waset, is the
            authentic ancient Egyptian name for the glorious city of Thebes
            (modern-day Luxor)—the historic heart of Egypt’s golden empire,
            majesty, and pharaonic heritage. Inspired by this profound legacy,
            our digitally-driven travel platform is founded and operated
            directly by officially licensed Egyptian tour guides and
            Egyptologists. Unlike traditional commercial agencies, we operate
            directly on the ground without the overhead costs of physical
            offices. This allows us to channel all our resources into what truly
            matters: providing you with top-tier, personalized, and
            budget-friendly private tours. Why Choose Waset Travel? Licensed &
            Certified Guides: Every tour is curated and led by certified
            Egyptologists holding official permits from the Egyptian Ministry of
            Tourism. You will experience history from the experts who live it.
            Fully Legal & Transparent: We operate with full financial
            transparency, backed by official tax registration, ensuring your
            peace of mind from booking to departure. Tailormade Experiences:
            Inspired by the grandeur of ancient Waset, we specialize in private,
            customizable itineraries—from the majestic Pyramids of Giza to the
            hidden gems of Luxor and Cairo. Best Value on the Ground: By cutting
            out the middleman and physical office costs, we offer exceptional
            quality tours at fair, direct-to-expert prices. At Waset Travel, we
            don't just show you Egypt; we connect you to the true majesty and
            history of the cradle of civilization. Let us craft an unforgettable
            journey tailored just for you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full h-80 lg:h-[420px] rounded-2xl overflow-hidden shadow-2xl"
        >
          <Image
            src="/HomePageImage/pexels-radwa-magdy-1718930-21668633.webp"
            alt="WasetTravel Luxury Experience"
            fill
            className="object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
