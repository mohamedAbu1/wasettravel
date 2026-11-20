"use client";

import { usePathname, useRouter } from "next/navigation";

const languages = [
  ["en", "EN"],
  ["fr", "FR"],
  ["de", "DE"],
  ["es", "ES"],
  ["it", "IT"],
  ["zh", "中文"],
];

export default function LanguageSelector({ mobile = false }) {
  const pathname = usePathname() || "/en";
  const router = useRouter();
  const segments = pathname.split("/").filter(Boolean);
  const hasLocale = languages.some(([value]) => value === segments[0]);
  const currentLocale = hasLocale ? segments[0] : "en";

  const handleChange = (event) => {
    const nextLocale = event.target.value;
    const pathSegments = hasLocale ? segments.slice(1) : segments;
    router.push(`/${nextLocale}${pathSegments.length ? `/${pathSegments.join("/")}` : ""}`);
  };

  return (
    <label className={`language-selector ${mobile ? "language-selector--mobile" : ""}`}>
      <span className="sr-only">Language</span>
      <select value={currentLocale} onChange={handleChange} aria-label="Language">
        {languages.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>
    </label>
  );
}
