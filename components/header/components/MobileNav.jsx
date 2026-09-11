"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiMenu, FiX } from "react-icons/fi";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation("header");
  const segments = pathname.split("/").filter(Boolean);
  const lang = segments[0] || "en";
  const links = [
    ["home", `/${lang}`],
    ["trips", `/${lang}/trips`],
    ["about", `/${lang}/about`],
    ["contact", `/${lang}/contact`],
    ["b2b", `/${lang}/b2b`],
  ];

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-black/20 text-white transition hover:border-[#c9a34a]"
      >
        {open ? <FiX size={22} /> : <FiMenu size={22} />}
      </button>
      {open && (
        <div className="absolute left-4 right-4 top-[calc(100%-4px)] rounded-2xl border border-white/15 bg-[#111]/95 p-3 shadow-2xl backdrop-blur-xl">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {links.map(([key, href]) => (
              <Link
                key={key}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white/85 transition hover:bg-[#c9a34a] hover:text-white"
              >
                {t(key)}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
