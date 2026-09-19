"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaTiktok } from "react-icons/fa";
import { MdEmail, MdArrowOutward } from "react-icons/md";
import { siteConfig } from "@/lib/siteConfig";

const Footer = () => {
  const { themeName } = useTheme();
  const { t: footerT } = useTranslation("footer");
  const { t } = useTranslation("ui");
  const pathname = usePathname();
  const locale = pathname?.split("/").filter(Boolean)[0] || "en";
  const socials = [
    ["Facebook", siteConfig.social.facebook, FaFacebookF],
    ["Instagram", siteConfig.social.instagram, FaInstagram],
    ["WhatsApp", siteConfig.whatsapp, FaWhatsapp],
    ["Email", `mailto:${siteConfig.email}`, MdEmail],
    ["TikTok", siteConfig.social.tiktok, FaTiktok],
  ];

  return (
    <footer className={`stone-footer w-full border-t px-5 pb-6 pt-14 sm:px-8 ${themeName === "light" ? "text-[#30271d]" : "text-white"}`}>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div className="max-w-sm"><Link href={`/${locale}`} className="flex items-center gap-3" aria-label="Waset Travel home"><span className="grid h-12 w-12 place-items-center rounded-2xl border border-[#e0b873]/40 bg-[#e0b873]/10 text-2xl text-[#e0b873]">𓂀</span><span><span className="block text-xl font-bold text-white">Waset<span className="text-[#e0b873]">Travel</span></span><span className="text-[10px] uppercase tracking-[0.2em] text-white/45">{t("curatedJourneys")}</span></span></Link><p className="mt-5 text-sm leading-7 text-white/55">{footerT("description")}</p><div className="mt-5 flex gap-2">{socials.map(([label, href, Icon]) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:-translate-y-1 hover:border-[#e0b873]/60 hover:bg-[#e0b873]/15 hover:text-[#e0b873]"><Icon /></a>)}</div></div>
          <div><p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#e0b873]">{t("explore")}</p><nav className="grid gap-3 text-sm text-white/65"><Link href={`/${locale}`} className="transition hover:text-[#f0c979]">{footerT("Home")}</Link><Link href={`/${locale}/about`} className="transition hover:text-[#f0c979]">{footerT("AboutUs")}</Link><Link href={`/${locale}/trips`} className="transition hover:text-[#f0c979]">{footerT("Trips")}</Link></nav></div>
          <div><p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#e0b873]">{t("support")}</p><nav className="grid gap-3 text-sm text-white/65"><Link href={`/${locale}/contact`} className="transition hover:text-[#f0c979]">{footerT("Contact")}</Link><Link href={`/${locale}/privacy-policy`} className="transition hover:text-[#f0c979]">{footerT("privacyPolicyLabel", { defaultValue: "Privacy Policy" })}</Link><Link href={`/${locale}/cancellation-policy`} className="transition hover:text-[#f0c979]">{footerT("cancellationPolicyLabel", { defaultValue: "Cancellation Policy" })}</Link></nav></div>
        <div className="rounded-2xl border border-[#e0b873]/20 bg-[#e0b873]/[.06] p-5"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e0b873]">{t("planEscape")}</p><h3 className="mt-3 text-xl font-bold text-white">{t("egyptWaiting")}</h3><p className="mt-2 text-sm leading-6 text-white/55">{t("footerPlanText")}</p><Link href={`/${locale}/contact`} className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#f0c979]">{t("talkTeam")} <MdArrowOutward /></Link></div>
        </div>
        <div className="flex flex-col gap-2 pt-5 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} WasetTravel. All rights reserved.</p><p>Made for meaningful journeys across Egypt.</p></div>
      </div>
    </footer>
  );
};

export default Footer;
