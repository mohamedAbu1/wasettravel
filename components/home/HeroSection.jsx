"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import Content from "./components/Content";
import LeftSocialIcons from "./components/LeftSocialIcons";
import { usePathname } from "next/navigation";
import catalog from "@/lib/imageCatalog";

const heroImage = catalog.hero;

export default function HeroSection() {
  const { theme } = useTheme();
  const { t } = useTranslation("home");
  const pathname = usePathname();
  const locale = pathname.split("/").filter(Boolean)[0] || "en";

  return (
    <section className={`hero-split relative grid min-h-[min(780px,92vh)] w-full overflow-hidden ${theme.background} ${theme.text}`}>
      <div className="hero-split-media order-1 relative min-h-[430px] overflow-hidden lg:order-2 lg:min-h-0">
        <Image
          src={heroImage}
          alt="Ancient Egyptian temple columns in Luxor"
          fill
          priority
          quality={75}
          sizes="(max-width: 1023px) 100vw, 35vw"
          className="object-cover object-center"
        />
        <div className="hero-split-media-overlay absolute inset-0" aria-hidden="true" />
        <div className="hero-media-location absolute left-6 top-28 z-10 sm:left-10 lg:left-14">
          <span className="hero-media-location__line" aria-hidden="true" />
          <div>
            <p className="hero-media-location__eyebrow">{t("FeaturedDestination", { defaultValue: "Featured destination" })}</p>
            <p className="hero-media-location__title">{t("LuxorUpperEgypt", { defaultValue: "Luxor · Upper Egypt" })}</p>
          </div>
        </div>
        <div className="hero-media-story absolute bottom-24 right-5 z-10 sm:right-10 lg:bottom-28 lg:right-14">
          <span className="hero-media-story__mark" aria-hidden="true">𓂀</span>
          <div>
            <p className="hero-media-story__title">{t("HistoryFeelsClose", { defaultValue: "Where history feels close" })}</p>
            <p className="hero-media-story__copy">{t("TempleNileMoments", { defaultValue: "Private temple visits · Nile moments" })}</p>
          </div>
        </div>
        <div className="absolute bottom-8 left-6 z-10 max-w-xs text-white sm:left-10 lg:left-14">
          <span className="hero-media-caption">{t("HeroMediaLabel", { defaultValue: "Waset Travel · Upper Egypt" })}</span>
          <p className="mt-2 text-sm leading-6 text-white/70">{t("HeroImageCaption", { defaultValue: "Ancient stone, living stories, unforgettable journeys." })}</p>
        </div>
      </div>

      <div className="hero-split-content order-2 relative flex items-center px-5 py-14 sm:px-10 lg:order-1 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-2xl">
          <motion.div initial={false} animate={{ opacity: 1, x: 0 }} transition={{ duration: .75, ease: "easeOut" }}>
            <div className="hero-eyebrow mb-5 flex items-center gap-3"><span className="hero-eyebrow-line" /><span>{t("Discover")}</span></div>
            <h1 className="hero-title max-w-xl text-5xl font-semibold leading-[.98] tracking-[-.045em] sm:text-7xl">{t("HeroTitlePrefix", { defaultValue: "Egypt," })} <span className="hero-title-accent">{t("HeroTitleAccent", { defaultValue: "etched" })}</span><br />{t("HeroTitleSuffix", { defaultValue: "in your memory." })}</h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/65 sm:text-lg">{t("HeroDescription", { defaultValue: "Curated journeys through Luxor, Aswan and the Nile, designed by local experts and shaped around the way you want to travel." })}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4"><a href="#discover" className="hero-primary-cta">{t("ExploreEgypt", { defaultValue: "Explore Egypt" })} <span aria-hidden="true">↗</span></a><a href={`/${locale}/about`} className="hero-secondary-cta">{t("OurStory", { defaultValue: "Our story" })}</a></div>
            <div className="hero-proof-row mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm text-white/60"><span><strong>12+</strong> {t("Destinations", { defaultValue: "destinations" })}</span><span><strong>4.9/5</strong> {t("TravelerRating", { defaultValue: "traveler rating" })}</span><span><strong>{t("Local", { defaultValue: "Local" })}</strong> {t("Experts", { defaultValue: "experts" })}</span></div>
            <LeftSocialIcons />
          </motion.div>

          <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: .75, delay: .12 }} className="hero-search-card mt-10 rounded-[1.5rem] p-5 sm:p-6">
            <Content />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
