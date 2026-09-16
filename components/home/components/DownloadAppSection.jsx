"use client";
import { FaGooglePlay, FaApple, FaGlobe, FaMapMarkedAlt, FaArrowRight } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function DownloadAppSection() {
  const { t } = useTranslation("home");

  return (
    <section className="stone-section w-full border-y border-[var(--line)] px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[.9fr_1.1fr]">
        <div className="max-w-xl">
          <p className="stone-kicker mb-3">Stay close to every journey</p>
          <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
            {t("DownloadOurAppNow")}
          </h2>
          <p className="mt-5 max-w-lg leading-8 text-[var(--muted)]">{t("pPhone")}</p>
          <div className="mt-7 flex flex-wrap gap-3 text-sm font-semibold text-[var(--muted)]">
            <span className="rounded-full border border-[var(--line)] bg-[var(--surface-raised)] px-4 py-2">Curated trips</span>
            <span className="rounded-full border border-[var(--line)] bg-[var(--surface-raised)] px-4 py-2">Local support</span>
            <span className="rounded-full border border-[var(--line)] bg-[var(--surface-raised)] px-4 py-2">Easy planning</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <a
          href="https://play.google.com/store/apps/details?id=your_app_id"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Download on Google Play"
          className="stone-card group flex min-h-28 w-full items-center justify-between rounded-2xl p-5 text-[var(--foreground)] transition hover:-translate-y-1"
        >
          <span className="flex items-center gap-3"><FaGooglePlay className="text-2xl text-[var(--color)]" /><span><span className="block text-xs text-[var(--muted)]">Available on</span><strong>{t("GooglePlay")}</strong></span></span><FaArrowRight className="text-xs text-[var(--muted)] transition group-hover:translate-x-1" />
        </a>

        {/* Apple App Store Button */}
        <a
          href="https://apps.apple.com/app/your_app_id"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Download on Apple App Store"
          className="stone-card group flex min-h-28 w-full items-center justify-between rounded-2xl p-5 text-[var(--foreground)] transition hover:-translate-y-1"
        >
          <span className="flex items-center gap-3"><FaApple className="text-2xl text-[var(--color)]" /><span><span className="block text-xs text-[var(--muted)]">Available on</span><strong>{t("AppStore")}</strong></span></span><FaArrowRight className="text-xs text-[var(--muted)] transition group-hover:translate-x-1" />
        </a>

        {/* Viator Button */}
        <a
          href="https://www.viator.com/your_page_link"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit our Viator page"
          className="stone-card group flex min-h-28 w-full items-center justify-between rounded-2xl p-5 text-[var(--foreground)] transition hover:-translate-y-1"
        >
          <span className="flex items-center gap-3"><FaGlobe className="text-2xl text-[var(--color)]" /><span><span className="block text-xs text-[var(--muted)]">Explore us on</span><strong>{t("Viator")}</strong></span></span><FaArrowRight className="text-xs text-[var(--muted)] transition group-hover:translate-x-1" />
        </a>

        {/* Tripadvisor Button */}
        <a
          href="https://www.tripadvisor.com/Attraction_Review-g294205-d34511536-Reviews-Waset_Travel-Luxor_Nile_River_Valley.html"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Read reviews on Tripadvisor"
          className="stone-card group flex min-h-28 w-full items-center justify-between rounded-2xl p-5 text-[var(--foreground)] transition hover:-translate-y-1"
        >
          <span className="flex items-center gap-3"><FaMapMarkedAlt className="text-2xl text-[var(--color)]" /><span><span className="block text-xs text-[var(--muted)]">Read reviews on</span><strong>{t("Tripadvisor")}</strong></span></span><FaArrowRight className="text-xs text-[var(--muted)] transition group-hover:translate-x-1" />
        </a>
        </div>
      </div>
    </section>
  );
}
