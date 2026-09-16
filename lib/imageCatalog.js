const catalog = {
  hero: "/iamges/pexels-alexazabache-3185480.webp",
  about: "/iamges/pexels-radwa-magdy-1718930-28144568.webp",
  journey: "/iamges/pexels-ozgomz-7566890.webp",
  cities: {
    luxor: "/Luxor/pexels-axp-photography-500641970-18934596.webp",
    aswan: "/Aswan/chrysanthe-gomree-_nubht5aO2w-unsplash.webp",
    cairo: "/Cairo/pexels-alexazabache-3290075.webp",
    fayoum: "/Fayoum/pexels-matteo-roman-1151921619-21315979.webp",
    hurghada: "/Hurghada/aswawa.webp",
    "marsa alam": "/Marsa_Alam/pexels-carla-1272382611-28002630.webp",
    "sharm el sheikh": "/Sharm_El_Sheikh/nmh.webp",
    siwa: "/Siwa/pexels-ast4rk-33661247.webp",
    alexandria: "/iamges/old-cairo-district.jpg",
  },
  categories: {
    historical: "/iamges/pexels-radwa-magdy-1718930-28144568.webp",
    "nile cruises": "/Nile%20Cruise/0222p12000k6c5981109F_W_1280_853_R5.webp",
    "luxury tours": "/iamges/Seabourn-Encore-2016-185.jpg",
    adventure: "/Fayoum/pexels-matteo-roman-1151921619-21315979.webp",
    "one day trips": "/iamges/pexels-alexazabache-3185480.webp",
    family: "/iamges/pexels-ozgomz-7566890.webp",
    wellness: "/iamges/pexels-milan-wouters-1903731614-29116365.webp",
    spiritual: "/iamges/pexels-radwa-magdy-1718930-28144568.webp",
  },
};

const normalize = (value) => String(value || "").trim().toLowerCase();

export function resolveCityImage(name) {
  const key = normalize(name);
  return Object.entries(catalog.cities).find(([city]) => key.includes(city))?.[1] || catalog.journey;
}

export function resolveCategoryImage(name) {
  const key = normalize(name);
  return Object.entries(catalog.categories).find(([category]) => key.includes(category))?.[1] || catalog.journey;
}

const toText = (value) => {
  if (!value) return "";
  if (typeof value === "object") return value.en || Object.values(value)[0] || "";
  return value;
};

export function resolveTripImage({ title, cities, categories } = {}) {
  const values = [title, ...(cities || []), ...(categories || [])].map(toText).map(normalize).join(" ");
  const cityMatch = Object.entries(catalog.cities).find(([city]) => values.includes(city));
  if (cityMatch) return cityMatch[1];
  const categoryMatch = Object.entries(catalog.categories).find(([category]) => values.includes(category));
  return categoryMatch?.[1] || catalog.journey;
}

export default catalog;
