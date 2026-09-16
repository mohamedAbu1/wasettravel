// Small local catalog used when the remote database is temporarily unavailable.
// It keeps the public browsing experience usable without pretending that trips
// were loaded from the database.
export const fallbackCities = [
  { id: "luxor", name: JSON.stringify({ en: "Luxor", ar: "الأقصر", de: "Luxor", es: "Luxor", fr: "Louxor", it: "Luxor", zh: "卢克索" }), images: JSON.stringify(["/Luxor/069b295f-764f-464c-b6f4-4ad1df9cdbbc.webp"]) },
  { id: "aswan", name: JSON.stringify({ en: "Aswan", ar: "أسوان", de: "Assuan", es: "Asuán", fr: "Assouan", it: "Assuan", zh: "阿斯旺" }), images: JSON.stringify(["/Aswan/pexels-yasmine-qasem-1054896-2034684.webp"]) },
  { id: "cairo", name: JSON.stringify({ en: "Cairo", ar: "القاهرة", de: "Kairo", es: "El Cairo", fr: "Le Caire", it: "Il Cairo", zh: "开罗" }), images: JSON.stringify(["/Cairo/pexels-axp-photography-500641970-18934598.webp"]) },
  { id: "hurghada", name: JSON.stringify({ en: "Hurghada", ar: "الغردقة", de: "Hurghada", es: "Hurgada", fr: "Hurghada", it: "Hurghada", zh: "赫尔格达" }), images: JSON.stringify(["/Hurghada/asda.webp"]) },
  { id: "siwa", name: JSON.stringify({ en: "Siwa", ar: "سيوة", de: "Siwa", es: "Siwa", fr: "Siwa", it: "Siwa", zh: "锡瓦" }), images: JSON.stringify(["/Siwa/pexels-yasmeenabdelaziz22-27529795.webp"]) },
];

export const fallbackCategories = [
  { id: "historical", name: JSON.stringify({ en: "Historical Tours", ar: "رحلات تاريخية", de: "Historische Touren", es: "Tours históricos", fr: "Circuits historiques", it: "Tour storici", zh: "历史之旅" }), images: JSON.stringify(["/Historicaltourism/pexels-tizzy-35549851.webp"]) },
  { id: "nile-cruise", name: JSON.stringify({ en: "Nile Cruises", ar: "رحلات نيلية", de: "Nilkreuzfahrten", es: "Cruceros por el Nilo", fr: "Croisières sur le Nil", it: "Crociere sul Nilo", zh: "尼罗河游轮" }), images: JSON.stringify(["/Nile Cruise/pexels-sahilcaptures-35645491.webp"]) },
  { id: "medical", name: JSON.stringify({ en: "Medical Trips", ar: "رحلات علاجية", de: "Medizinische Reisen", es: "Viajes médicos", fr: "Voyages médicaux", it: "Viaggi medici", zh: "医疗旅行" }), images: JSON.stringify(["/Medical trips/youhana-nassif-YBpSX76CQaE-unsplash.webp"]) },
];
