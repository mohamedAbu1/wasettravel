"use client";
import { FaGooglePlay, FaApple, FaGlobe, FaMapMarkedAlt, FaArrowRight } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function DownloadAppSection() {
  const { t } = useTranslation("home");
  const comingSoon = t("ComingSoon", { defaultValue: "Coming soon" });

  const ComingSoonCard = ({ icon: Icon, title }) => (
    <div aria-label={`${title} - ${comingSoon}`} className="stone-card flex min-h-28 w-full items-center justify-between rounded-2xl p-5 text-[var(--muted)] opacity-80">
      <span className="flex items-center gap-3"><Icon className="text-2xl text-[var(--color)]" /><span><span className="block text-xs text-[var(--muted)]">{comingSoon}</span><strong>{title}</strong></span></span>
    </div>
  );

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
        <ComingSoonCard icon={FaGooglePlay} title={t("GooglePlay")} />
        <ComingSoonCard icon={FaApple} title={t("AppStore")} />
        <ComingSoonCard icon={FaGlobe} title={t("Viator")} />

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
