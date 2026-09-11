"use client";
import { FaGooglePlay, FaApple, FaGlobe, FaMapMarkedAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function DownloadAppSection() {
  const { t } = useTranslation("home");

  return (
    <section className="w-full border-y border-white/10 bg-[#121212] px-4 py-12 text-[#F5F5F5] sm:py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-5 text-center">
      {/* Title */}
      <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
        {t("DownloadOurAppNow")}
      </h2>
      <p className="max-w-xl text-center leading-7 text-white/70">
        {t("pPhone")}
      </p>

      {/* Store Links */}
      <div className="mt-2 grid w-full max-w-4xl grid-cols-1 justify-center gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Google Play Button */}
        <a
          href="https://play.google.com/store/apps/details?id=your_app_id"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Download on Google Play"
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 font-semibold text-white shadow-md transition-colors hover:bg-green-800"
        >
          <FaGooglePlay size={22} />
          <span>{t("GooglePlay")}</span>
        </a>

        {/* Apple App Store Button */}
        <a
          href="https://apps.apple.com/app/your_app_id"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Download on Apple App Store"
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-black px-4 py-3 font-semibold text-white shadow-md transition-colors hover:bg-gray-900"
        >
          <FaApple size={22} />
          <span>{t("AppStore")}</span>
        </a>

        {/* Viator Button */}
        <a
          href="https://www.viator.com/your_page_link"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit our Viator page"
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#c9a34a] px-4 py-3 font-semibold text-white shadow-md transition-colors hover:bg-[#a67c00]"
        >
          <FaGlobe size={22} />
          <span>{t("Viator")}</span>
        </a>

        {/* Tripadvisor Button */}
        <a
          href="https://www.tripadvisor.com/Attraction_Review-g294205-d34511536-Reviews-Waset_Travel-Luxor_Nile_River_Valley.html"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Read reviews on Tripadvisor"
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-3 font-semibold text-white shadow-md transition-colors hover:bg-teal-800"
        >
          <FaMapMarkedAlt size={22} />
          <span>{t("Tripadvisor")}</span>
        </a>
      </div>
      </div>
    </section>
  );
}
