"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Logo() {
  const pathname = usePathname();
  const locale = pathname.split("/").filter(Boolean)[0] || "en";

  return (
    <motion.div initial={false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
      <Link href={`/${locale}`} aria-label="WasetTravel home" className="brand-mark">
        <svg className="brand-mark__icon" viewBox="0 0 96 96" aria-hidden="true">
          <rect x="3" y="3" width="90" height="90" rx="28" fill="none" stroke="currentColor" strokeWidth="3" />
          <path fill="currentColor" d="M21 25h10l8 29 8-20h8l8 20 8-29h10L70 72h-9l-9-22-9 22h-9z" />
          <path d="M21 78h54" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <span className="brand-mark__copy">
          <span className="brand-mark__name">Waset<span>Travel</span></span>
          <span className="brand-mark__tagline">Curated Egypt journeys</span>
        </span>
      </Link>
    </motion.div>
  );
}
