import "dotenv/config";
import mysql from "mysql2/promise";
import { randomUUID } from "node:crypto";

const locales = ["en", "de", "es", "fr", "it", "zh"];
const imageBase = "/iamges";

const title = {
  en: "Kom Ombo and Edfu Temples Day Trip from Aswan",
  de: "Tagesausflug von Assuan zu den Tempeln von Kom Ombo und Edfu",
  es: "Excursión de un día de Asuán a los templos de Kom Ombo y Edfu",
  fr: "Excursion d'une journée d'Assouan aux temples de Kom Ombo et Edfou",
  it: "Escursione di un giorno da Assuan ai templi di Kom Ombo ed Edfu",
  zh: "从阿斯旺出发的康翁波与埃德富神庙一日游",
};

const description = {
  en: "Travel north from Aswan through the Nile Valley to two remarkable Ptolemaic sanctuaries. Discover Kom Ombo's unique double temple dedicated to Sobek and Haroeris, then explore the remarkably preserved Temple of Horus at Edfu with a private Egyptologist guide. The day includes private air-conditioned transport, lunch, bottled water, and hotel pickup and drop-off.",
  de: "Fahren Sie von Assuan durch das Niltal zu zwei außergewöhnlichen Heiligtümern aus der ptolemäischen Zeit. Entdecken Sie den Doppeltempel von Kom Ombo für Sobek und Haroeris und erkunden Sie anschließend den hervorragend erhaltenen Horus-Tempel von Edfu mit einem privaten Ägyptologen. Inklusive privatem klimatisiertem Fahrzeug, Mittagessen, Wasser sowie Abholung und Rückfahrt zum Hotel.",
  es: "Viaja al norte desde Asuán por el valle del Nilo hasta dos santuarios ptolemaicos excepcionales. Descubre el singular templo doble de Kom Ombo, dedicado a Sobek y Haroeris, y visita después el magníficamente conservado templo de Horus en Edfu con un egiptólogo privado. Incluye transporte privado con aire acondicionado, almuerzo, agua y recogida y regreso al hotel.",
  fr: "Partez d'Assouan vers le nord à travers la vallée du Nil pour découvrir deux sanctuaires ptolémaïques remarquables. Explorez le temple double de Kom Ombo dédié à Sobek et Haroéris, puis le temple d'Horus à Edfou, exceptionnellement bien conservé, avec un égyptologue privé. Transport privé climatisé, déjeuner, eau, prise en charge et retour à l'hôtel inclus.",
  it: "Viaggia verso nord da Assuan attraverso la valle del Nilo per scoprire due straordinari santuari di epoca tolemaica. Ammira il raro tempio doppio di Kom Ombo dedicato a Sobek e Haroeri, poi visita il magnificamente conservato tempio di Horus a Edfu con un egittologo privato. Il tour include veicolo privato climatizzato, pranzo, acqua e trasferimenti da e per l'hotel.",
  zh: "从阿斯旺沿尼罗河谷向北，探访两座重要的托勒密时期圣殿。参观供奉索贝克与哈罗厄里斯的独特双神庙康翁波，再由私人埃及学家带您探索保存完好的埃德富荷鲁斯神庙。行程包含私人空调车辆、午餐、瓶装水以及阿斯旺酒店接送。",
};

const includeTexts = {
  en: ["Private English-speaking Egyptologist guide", "Private air-conditioned vehicle", "Hotel pickup and drop-off in Aswan", "Lunch at a local restaurant or boxed lunch", "Bottled water during the tour", "All service charges and taxes"],
  de: ["Privater englischsprachiger Ägyptologe", "Privates klimatisiertes Fahrzeug", "Abholung und Rückfahrt zum Hotel in Assuan", "Mittagessen im Restaurant oder Lunchbox", "Wasser während der Tour", "Alle Servicegebühren und Steuern"],
  es: ["Egiptólogo privado de habla inglesa", "Vehículo privado con aire acondicionado", "Recogida y regreso al hotel en Asuán", "Almuerzo en restaurante local o picnic", "Agua embotellada durante el tour", "Todos los cargos de servicio e impuestos"],
  fr: ["Guide égyptologue privé anglophone", "Véhicule privé climatisé", "Prise en charge et retour à l'hôtel à Assouan", "Déjeuner au restaurant local ou panier-repas", "Eau en bouteille pendant l'excursion", "Tous les frais de service et taxes"],
  it: ["Egittologo privato di lingua inglese", "Veicolo privato climatizzato", "Prelievo e rientro in hotel ad Assuan", "Pranzo in ristorante locale o al sacco", "Acqua in bottiglia durante il tour", "Tutti i costi di servizio e le tasse"],
  zh: ["私人英语埃及学家导游", "私人空调车辆", "阿斯旺酒店接送", "当地餐厅午餐或盒装午餐", "行程中的瓶装水", "所有服务费和税费"],
};

const exclusionTexts = {
  en: ["Entrance fees to Kom Ombo and Edfu temples unless specified in the package", "Gratuities for the guide and driver", "Personal expenses", "Foreign-language guide surcharge"],
  de: ["Eintritt zu den Tempeln von Kom Ombo und Edfu, sofern nicht im Paket enthalten", "Trinkgelder für Guide und Fahrer", "Persönliche Ausgaben", "Zuschlag für fremdsprachigen Guide"],
  es: ["Entradas a los templos de Kom Ombo y Edfu salvo indicación en el paquete", "Propinas para el guía y el conductor", "Gastos personales", "Suplemento por guía en otro idioma"],
  fr: ["Billets d'entrée aux temples de Kom Ombo et d'Edfou sauf indication contraire", "Pourboires du guide et du chauffeur", "Dépenses personnelles", "Supplément pour guide dans une autre langue"],
  it: ["Ingressi ai templi di Kom Ombo ed Edfu salvo diversa indicazione nel pacchetto", "Mance per guida e autista", "Spese personali", "Supplemento per guida in lingua straniera"],
  zh: ["康翁波和埃德富神庙门票，除非套餐另有说明", "导游和司机小费", "个人消费", "外语导游附加费"],
};

const activities = [
  { time: "07:00", text: { en: "Hotel pickup in Aswan with your private Egyptologist guide and driver.", de: "Abholung am Hotel in Assuan mit privatem Ägyptologen und Fahrer.", es: "Recogida en el hotel de Asuán con su egiptólogo y conductor privados.", fr: "Prise en charge à l'hôtel à Assouan avec votre égyptologue et chauffeur privés.", it: "Prelievo in hotel ad Assuan con egittologo e autista privati.", zh: "在阿斯旺酒店与私人埃及学家导游和司机会合。" } },
  { time: "07:30", text: { en: "Scenic drive north through the Nile Valley to Kom Ombo, approximately 45 minutes.", de: "Panoramafahrt durch das Niltal nach Kom Ombo, etwa 45 Minuten.", es: "Ruta panorámica por el valle del Nilo hasta Kom Ombo, aproximadamente 45 minutos.", fr: "Route panoramique dans la vallée du Nil jusqu'à Kom Ombo, environ 45 minutes.", it: "Percorso panoramico nella valle del Nilo fino a Kom Ombo, circa 45 minuti.", zh: "沿尼罗河谷向北前往康翁波，车程约45分钟。" } },
  { time: "09:00", text: { en: "Explore Kom Ombo's double temple of Sobek and Haroeris and its adjoining Crocodile Museum.", de: "Besichtigung des Doppeltempels von Sobek und Haroeris sowie des Krokodil-Museums.", es: "Visita al templo doble de Sobek y Haroeris y al Museo del Cocodrilo.", fr: "Visite du temple double de Sobek et Haroéris et du musée du Crocodile.", it: "Visita al tempio doppio di Sobek e Haroeri e al Museo dei Coccodrilli.", zh: "探索供奉索贝克与哈罗厄里斯的康翁波双神庙及鳄鱼博物馆。" } },
  { time: "10:30", text: { en: "Continue north to Edfu, approximately 65 km and one hour by road.", de: "Weiterfahrt nach Edfu, etwa 65 km und eine Stunde Fahrt.", es: "Continuación hacia Edfu, unos 65 km y una hora por carretera.", fr: "Continuation vers Edfou, environ 65 km et une heure de route.", it: "Proseguimento verso Edfu, circa 65 km e un'ora di viaggio.", zh: "继续向北前往埃德富，约65公里、车程一小时。" } },
  { time: "12:00", text: { en: "Visit the great pylon, courtyard, and sanctuary of the Temple of Horus at Edfu.", de: "Besichtigung des großen Pylons, des Hofs und des Heiligtums des Horus-Tempels in Edfu.", es: "Visita al gran pilono, patio y santuario del templo de Horus en Edfu.", fr: "Visite du grand pylône, de la cour et du sanctuaire du temple d'Horus à Edfou.", it: "Visita al grande pilone, al cortile e al santuario del tempio di Horus a Edfu.", zh: "参观埃德富荷鲁斯神庙的大门、庭院与圣所。" } },
  { time: "13:30", text: { en: "Enjoy a boxed lunch or lunch at a local restaurant.", de: "Mittagessen als Lunchbox oder in einem lokalen Restaurant.", es: "Almuerzo tipo picnic o en un restaurante local.", fr: "Déjeuner sous forme de panier-repas ou dans un restaurant local.", it: "Pranzo al sacco o in un ristorante locale.", zh: "享用盒装午餐或当地餐厅午餐。" } },
  { time: "14:15", text: { en: "Return transfer to your hotel in Aswan; optional Luxor drop-off available on request.", de: "Rückfahrt zu Ihrem Hotel in Assuan; auf Anfrage ist ein Ausstieg in Luxor möglich.", es: "Regreso a su hotel en Asuán; traslado opcional a Luxor bajo petición.", fr: "Retour à votre hôtel à Assouan; dépôt optionnel à Louxor sur demande.", it: "Rientro in hotel ad Assuan; su richiesta è possibile il trasferimento a Luxor.", zh: "返回阿斯旺酒店；如需在卢克索下车，可提前申请。" } },
];

const detailRows = [
  ["Destinations", { en: "Kom Ombo Temple, Edfu Temple", es: "Templo de Kom Ombo, templo de Edfu", fr: "Temple de Kom Ombo, temple d'Edfou", de: "Tempel von Kom Ombo, Tempel von Edfu", it: "Tempio di Kom Ombo, tempio di Edfu", zh: "康翁波神庙、埃德富神庙" }],
  ["Duration", { en: "Approximately 9 hours (07:00 AM - 04:00 PM)", es: "Aproximadamente 9 horas (07:00 - 16:00)", fr: "Environ 9 heures (07:00 - 16:00)", de: "Etwa 9 Stunden (07:00 - 16:00 Uhr)", it: "Circa 9 ore (07:00 - 16:00)", zh: "约9小时（07:00 - 16:00）" }],
  ["Location", { en: "Kom Ombo and Edfu, Aswan Governorate", es: "Kom Ombo y Edfu, gobernación de Asuán", fr: "Kom Ombo et Edfou, gouvernorat d'Assouan", de: "Kom Ombo und Edfu, Gouvernement Assuan", it: "Kom Ombo ed Edfu, governatorato di Assuan", zh: "康翁波与埃德富，阿斯旺省" }],
  ["Guide", { en: "Private licensed Egyptologist guide", es: "Guía egiptólogo privado acreditado", fr: "Guide égyptologue privé agréé", de: "Privater lizenzierter Ägyptologe", it: "Egittologo privato abilitato", zh: "私人持证埃及学家导游" }],
  ["Transport", { en: "Private air-conditioned vehicle", es: "Vehículo privado con aire acondicionado", fr: "Véhicule privé climatisé", de: "Privates klimatisiertes Fahrzeug", it: "Veicolo privato climatizzato", zh: "私人空调车辆" }],
  ["Group Type", { en: "Private tour for two guests sharing", es: "Tour privado para dos personas", fr: "Visite privée pour deux personnes", de: "Private Tour für zwei gemeinsam reisende Gäste", it: "Tour privato per due ospiti", zh: "两人私家团" }],
  ["Meals", { en: "Lunch included", es: "Almuerzo incluido", fr: "Déjeuner inclus", de: "Mittagessen inklusive", it: "Pranzo incluso", zh: "包含午餐" }],
  ["Start Point", { en: "Your hotel in Aswan", es: "Su hotel en Asuán", fr: "Votre hôtel à Assouan", de: "Ihr Hotel in Assuan", it: "Il vostro hotel ad Assuan", zh: "阿斯旺酒店" }],
];

const insertMany = async (connection, table, columns, rows) => {
  if (!rows.length) return;
  const placeholders = rows.map(() => `(${columns.map(() => "?").join(",")})`).join(",");
  await connection.execute(`INSERT INTO ${table} (${columns.join(",")}) VALUES ${placeholders}`, rows.flat());
};

const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectTimeout: 5000,
});

try {
  const [existing] = await db.execute("SELECT id FROM trips WHERE JSON_UNQUOTE(JSON_EXTRACT(title, '$.en')) = ? LIMIT 1", [title.en]);
  if (existing.length) {
    console.log(`Trip already exists: ${existing[0].id}`);
    process.exitCode = 0;
  } else {
    const tripId = randomUUID();
    await db.beginTransaction();
    await db.execute(
      `INSERT INTO trips (id, title, description, currency, duration, duration_unit, cover_image, gallery_images, priceLevel, group_price, solo_price, discount_percent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tripId,
        JSON.stringify(title),
        JSON.stringify(description),
        "USD",
        9,
        "hours",
        `${imageBase}/ruins-ancient-temple-sebek-kom-ombo-egypt_556412-1263.avif`,
        JSON.stringify([
          `${imageBase}/ruins-ancient-temple-sebek-kom-ombo-egypt_556412-1263.avif`,
          "/Luxor/Dendera.webp",
          `${imageBase}/nile-cruise-egypt-slider-1200x600.jpg`,
        ]),
        "Economy",
        90,
        90,
        "0",
      ],
    );

    await insertMany(db, "includes", ["id", "trip_id", "include_translations"], includeTexts.en.map((_, index) => [
      randomUUID(),
      tripId,
      JSON.stringify(Object.fromEntries(locales.map((locale) => [locale, includeTexts[locale][index]]))),
    ]));
    await insertMany(db, "exclusions", ["id", "trip_id", "Exclusions_translations"], exclusionTexts.en.map((_, index) => [
      randomUUID(),
      tripId,
      JSON.stringify(Object.fromEntries(locales.map((locale) => [locale, exclusionTexts[locale][index]]))),
    ]));
    await insertMany(db, "trip_cities", ["id", "trip_id", "city_id"], [[randomUUID(), tripId, "b1bac522-aa55-4d19-aae5-67e1fd01b9db"]]);
    await insertMany(db, "trip_categories", ["id", "trip_id", "category_id"], [[randomUUID(), tripId, "95c5d3a9-ed86-4f44-89c9-12e8ff5d5b09"]]);

    const [dayId] = [randomUUID()];
    await insertMany(db, "trip_days", ["id", "trip_id", "day_number"], [[dayId, tripId, 1]]);
    await insertMany(db, "day_activities", ["id", "day_id", "time", "activity_translations"], activities.map((activity) => [randomUUID(), dayId, activity.time, JSON.stringify(activity.text)]));
    await insertMany(db, "trip_details", ["id", "trip_id", "option_key", "translations", "detail_values"], detailRows.map(([key, values]) => [randomUUID(), tripId, key, JSON.stringify(Object.fromEntries(locales.map((locale) => [locale, ({ Destinations: { en: "Destinations", es: "Destinos", fr: "Destinations", de: "Reiseziele", it: "Destinazioni", zh: "目的地" }, Duration: { en: "Duration", es: "Duración", fr: "Durée", de: "Dauer", it: "Durata", zh: "持续时间" }, Location: { en: "Location", es: "Ubicación", fr: "Lieu", de: "Ort", it: "Luogo", zh: "地点" }, Guide: { en: "Guide", es: "Guía", fr: "Guide", de: "Reiseführer", it: "Guida", zh: "导游" }, Transport: { en: "Transport", es: "Transporte", fr: "Transport", de: "Transport", it: "Trasporto", zh: "交通" }, "Group Type": { en: "Group Type", es: "Tipo de grupo", fr: "Type de groupe", de: "Gruppentyp", it: "Tipo di gruppo", zh: "团体类型" }, Meals: { en: "Meals", es: "Comidas", fr: "Repas", de: "Mahlzeiten", it: "Pasti", zh: "餐饮" }, "Start Point": { en: "Start Point", es: "Punto de inicio", fr: "Point de départ", de: "Startpunkt", it: "Punto di partenza", zh: "起点" } })[key][locale]]))), JSON.stringify(values)]));
    await db.commit();
    console.log(`Trip inserted successfully: ${tripId}`);
  }
} catch (error) {
  try { await db.rollback(); } catch { /* Preserve the original database error. */ }
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await db.end();
}
