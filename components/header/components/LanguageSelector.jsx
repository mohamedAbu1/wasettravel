"use client";

import { usePathname, useRouter } from "next/navigation";
import TravelSelectField from "@/components/home/components/TravelSelectField";

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

  const handleChange = (nextLocale) => {
    const pathSegments = hasLocale ? segments.slice(1) : segments;
    router.push(`/${nextLocale}${pathSegments.length ? `/${pathSegments.join("/")}` : ""}`);
  };

  return (
    <label className={`language-selector ${mobile ? "language-selector--mobile" : ""}`}>
      <span className="sr-only">Language</span>
      <TravelSelectField
        compact
        className="language-selector__field"
        label="Language"
        value={currentLocale}
        onChange={handleChange}
        options={languages.map(([value, label]) => ({ value, label }))}
      />
    </label>
  );
}
