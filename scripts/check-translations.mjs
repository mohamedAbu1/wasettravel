import fs from "node:fs";
import path from "node:path";

const localesDir = path.resolve("locales");
const languages = fs
  .readdirSync(localesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const flatten = (value, prefix = "", result = {}) => {
  for (const [key, child] of Object.entries(value)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === "object" && !Array.isArray(child)) {
      flatten(child, fullKey, result);
    } else {
      result[fullKey] = child;
    }
  }
  return result;
};

const translations = Object.fromEntries(
  languages.map((language) => [
    language,
    flatten(JSON.parse(fs.readFileSync(path.join(localesDir, language, "translation.json"), "utf8"))),
  ]),
);

const allKeys = [...new Set(Object.values(translations).flatMap(Object.keys))].sort();
const errors = [];

for (const language of languages) {
  const values = translations[language];
  const missing = allKeys.filter((key) => !(key in values));
  const empty = Object.keys(values).filter(
    (key) => typeof values[key] === "string" && !values[key].trim(),
  );

  if (missing.length || empty.length) {
    errors.push(`${language}: missing=${missing.join(",") || "none"}; empty=${empty.join(",") || "none"}`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Translation check passed: ${languages.join(", ")} / ${allKeys.length} keys`);
