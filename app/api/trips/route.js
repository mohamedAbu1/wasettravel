import { connectDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { requireAdmin } from "@/lib/auth/admin";
import { toPublicImageUrl } from "@/lib/publicImageUrl";
import { normalizeGalleryImages } from "@/lib/galleryImages";

// دالة آمنة لتحويل أي قيمة إلى JSON نصي
const safeStringify = (value) => {
  try {
    return JSON.stringify(value ?? []);
  } catch {
    return "[]";
  }
};

export async function POST(req) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  let db;
  try {
    const body = await req.json();
    const tripId = uuidv4();

    const pool = await connectDB();
    db = await pool.getConnection();
    await db.beginTransaction();

    // ✅ إدخال بيانات الرحلة الأساسية
    console.log("➡️ Saving trip base data:", body);
    await db.execute(
      `INSERT INTO trips 
       (id, title, description, currency, duration, duration_unit, cover_image, gallery_images, priceLevel, group_price, solo_price, discount_percent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tripId,
        JSON.stringify(body.title),
        JSON.stringify(body.description),
        body.currency,
        body.duration,
        body.duration_unit,
        body.cover_image,
        JSON.stringify(normalizeGalleryImages(body.gallery_images)),
        body.priceLevel,
        body.group_price,
        body.solo_price,
        String(body.discountPercent ?? "0"),
      ],
    );
    console.log("✅ Trip inserted with ID:", tripId);

    // ✅ إدخال includes
    if (body.includes?.length > 0) {
      console.log("➡️ Inserting includes:", body.includes);
      const includesData = body.includes.map((inc) => [
        uuidv4(),
        tripId,
        safeStringify(inc),
      ]);
      await db.query(
        "INSERT INTO includes (id, trip_id, include_translations) VALUES ?",
        [includesData],
      );
      console.log("✅ Includes inserted:", includesData.length);
    }

    // ✅ إدخال exclusions
    if (body.exclusions?.length > 0) {
      console.log("➡️ Inserting exclusions:", body.exclusions);
      const exclusionsData = body.exclusions.map((exc) => [
        uuidv4(),
        tripId,
        safeStringify(exc),
      ]);
      await db.query(
        "INSERT INTO exclusions (id, trip_id, exclusions_translations) VALUES ?",
        [exclusionsData],
      );
      console.log("✅ Exclusions inserted:", exclusionsData.length);
    }

    // ✅ إدخال المدن
    if (body.cities?.length > 0) {
      console.log("➡️ Inserting cities:", body.cities);
      const citiesData = body.cities.map((cityId) => [
        uuidv4(),
        tripId,
        cityId,
      ]);
      await db.query(
        "INSERT INTO trip_cities (id, trip_id, city_id) VALUES ?",
        [citiesData],
      );
      console.log("✅ Cities inserted:", citiesData.length);
    }

    // ✅ إدخال التصنيفات
    if (body.categories?.length > 0) {
      console.log("➡️ Inserting categories:", body.categories);
      const categoriesData = body.categories.map((catId) => [
        uuidv4(),
        tripId,
        catId,
      ]);
      await db.query(
        "INSERT INTO trip_categories (id, trip_id, category_id) VALUES ?",
        [categoriesData],
      );
      console.log("✅ Categories inserted:", categoriesData.length);
    }

    // ✅ إدخال الأيام والأنشطة
    if (body.itinerary?.length > 0) {
      console.log("➡️ Inserting itinerary:", body.itinerary);
      for (const [index, day] of body.itinerary.entries()) {
        const dayId = uuidv4();
        await db.execute(
          "INSERT INTO trip_days (id, trip_id, day_number) VALUES (?, ?, ?)",
          [dayId, tripId, day.day_number || index + 1],
        );
        console.log("✅ Day inserted:", dayId);

        if (day.activities?.length > 0) {
          console.log(
            "➡️ Inserting activities for day:",
            dayId,
            day.activities,
          );
          const activitiesData = day.activities.map((act) => [
            uuidv4(),
            dayId,
            act.time,
            safeStringify(act.activity_translations || act.activity),
          ]);
          await db.query(
            "INSERT INTO day_activities (id, day_id, time, activity_translations) VALUES ?",
            [activitiesData],
          );
          console.log("✅ Activities inserted:", activitiesData.length);
        }
      }
    }

    // ✅ إدخال تفاصيل الرحلة (trip_details)
    if (body.details?.length > 0) {
      console.log("➡️ Inserting trip details:", body.details);
      const detailsData = body.details
        .map((detail) => ({
          optionKey: detail.option_key || detail.key,
          translations: detail.translations || {},
          values: detail.values || detail.detail_values || {},
        }))
        .filter((detail) => detail.optionKey)
        .map((detail) => [
          uuidv4(),
          tripId,
          detail.optionKey,
          JSON.stringify(detail.translations),
          JSON.stringify(detail.values),
        ]);

      if (detailsData.length > 0) {
        await db.query(
          "INSERT INTO trip_details (id, trip_id, option_key, translations, detail_values) VALUES ?",
          [detailsData],
        );
      }

      console.log("✅ Trip details inserted:", detailsData.length);
    }

    await db.commit();
    return new Response(JSON.stringify({ success: true, tripId }), {
      status: 201,
    });
  } catch (err) {
    if (db) {
      try { await db.rollback(); } catch (rollbackError) { console.error("Rollback failed:", rollbackError.message); }
    }
    console.error("❌ API Error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 },
    );
  } finally {
    if (db) db.release();
  }
}

export async function GET(req) {
  const summary = new URL(req.url).searchParams.get("summary") === "1";
  try {
    const db = await connectDB();
    const query = summary
      ? `
      SELECT
        t.id,
        t.title,
        t.currency,
        t.cover_image,
        t.group_price,
        COALESCE((SELECT AVG(r.rating) FROM reviews r WHERE r.trip_id = t.id), 0) AS rating,
        COALESCE((SELECT COUNT(*) FROM reviews r WHERE r.trip_id = t.id), 0) AS review_count,
        COALESCE((SELECT COUNT(*) FROM purchases p WHERE p.trip_id = t.id), 0) AS purchase_count
      FROM trips t
    `
      : `
      SELECT 
        t.*,
        COALESCE((SELECT COUNT(*) FROM reviews r WHERE r.trip_id = t.id), 0) AS review_count,
        COALESCE((SELECT COUNT(*) FROM purchases p WHERE p.trip_id = t.id), 0) AS purchase_count,
        COALESCE(
          CAST(
            (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', c.id, 'name', c.name, 'images', c.images)) 
             FROM trip_cities tc 
             JOIN cities c ON tc.city_id = c.id 
             WHERE tc.trip_id = t.id)
          AS CHAR
        ), '[]'
        ) AS cities,
        COALESCE(
          CAST(
            (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', cat.id, 'name', cat.name, 'images', cat.images)) 
             FROM trip_categories tc 
             JOIN categories cat ON tc.category_id = cat.id 
             WHERE tc.trip_id = t.id)
          AS CHAR
        ), '[]'
        ) AS categories,
        COALESCE(
          CAST(
            (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', inc.id, 'include_translations', inc.include_translations)) 
             FROM includes inc WHERE inc.trip_id = t.id)
          AS CHAR
        ), '[]'
        ) AS includes,
        COALESCE(
          CAST(
            (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', exc.id, 'exclusions_translations', exc.exclusions_translations)) 
             FROM exclusions exc WHERE exc.trip_id = t.id)
          AS CHAR
        ), '[]'
        ) AS exclusions,
        COALESCE(
          CAST(
            (SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                  'id', td.id, 
                  'day_number', td.day_number,
                  'activities', (
                    SELECT JSON_ARRAYAGG(
                      JSON_OBJECT(
                        'id', da.id,
                        'time', da.time,
                        'activity_translations', da.activity_translations
                      )
                    )
                    FROM day_activities da WHERE da.day_id = td.id
                  )
                )
             ) 
             FROM trip_days td WHERE td.trip_id = t.id)
          AS CHAR
        ), '[]'
        ) AS days,
        COALESCE(
          CAST(
            (SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', r.id,
                'user_id', r.user_id,
                'name', r.name,
                'comment', r.comment,
                'rating', r.rating,
                'avatar_url', r.avatar_url,
                'created_at', r.created_at
              )
            )
            FROM reviews r WHERE r.trip_id = t.id)
          AS CHAR
        ), '[]'
        ) AS reviews,
        COALESCE(
          CAST(
            (SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', td.id,
                'option_key', td.option_key,
                'translations', td.translations,
                'detail_values', td.detail_values
              )
            )
            FROM trip_details td WHERE td.trip_id = t.id)
          AS CHAR
        ), '[]'
        ) AS trip_details
      FROM trips t
    `;
    const [trips] = await db.query(query);

    const safeParse = (value) => {
      try {
        return value ? JSON.parse(value) : [];
      } catch {
        return [];
      }
    };

    const safeTranslations = (value) => {
      if (!value || typeof value !== "string") return value;
      try {
        return JSON.parse(value);
      } catch {
        return { en: value };
      }
    };

    const parsedTrips = trips.map((trip) => ({
      ...trip,
      title: safeTranslations(trip.title),
      description: safeTranslations(trip.description),
      cover_image: toPublicImageUrl(trip.cover_image),
      solo_price: Number(trip.solo_price),
      group_price: Number(trip.group_price),
      currency: trip.currency,
      duration: Number(trip.duration),
      priceLevel: trip.priceLevel,
      duration_unit: trip.duration_unit || "",
      gallery_images: normalizeGalleryImages(trip.gallery_images),
      cities: safeParse(trip.cities),
      categories: safeParse(trip.categories),
      includes: safeParse(trip.includes),
      exclusions: safeParse(trip.exclusions),
      itinerary: safeParse(trip.days),
      reviews: safeParse(trip.reviews),
      review_count: Number(trip.review_count ?? 0),
      purchase_count: Number(trip.purchase_count ?? 0),
      trip_details: safeParse(trip.trip_details),
      discountPercent: Number(trip.discount_percent ?? 0),
    }));
    return new Response(JSON.stringify({ success: true, trips: parsedTrips }), {
      status: 200,
      headers: { "Cache-Control": summary ? "no-store" : "public, max-age=3600" },
    });
  } catch (err) {
    console.error("GET /api/trips database unavailable; returning an empty catalog:", err.message);
    return new Response(JSON.stringify(summary
      ? { success: true, trips: [], degraded: true }
      : { success: false, error: "Trips catalog is temporarily unavailable" }), {
      status: summary ? 200 : 503,
      headers: { "Cache-Control": "no-store", "Retry-After": "30" },
    });
  }
}
