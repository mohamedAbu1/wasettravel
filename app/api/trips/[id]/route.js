import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { requireAdmin } from "@/lib/auth/admin";
import { toPublicImageUrl } from "@/lib/publicImageUrl";
import { normalizeGalleryImages } from "@/lib/galleryImages";

const parseJson = (value, fallback) => {
  if (value == null) return fallback;
  if (typeof value !== "string") return value;
  try { return JSON.parse(value); } catch { return fallback; }
};

// ================== GET ==================
export async function GET(req, context) {
  try {
    const { id } = await context.params;
    const db = await connectDB();

    const [rows] = await db.query(`SELECT * FROM trips WHERE id = ? LIMIT 1`, [id]);
    if (!rows.length) {
      return NextResponse.json({ success: false, error: "Trip not found" }, { status: 404 });
    }
    const trip = rows[0];

    // ✅ جلب المدن
    const [cities] = await db.query(
      `SELECT tc.id, tc.city_id, c.name 
       FROM trip_cities tc 
       JOIN cities c ON tc.city_id = c.id 
       WHERE tc.trip_id = ?`,
      [id]
    );
    const parsedCities = cities.map((c) => ({
      ...c,
      name: parseJson(c.name, {}),
    }));

    // ✅ جلب الفئات
    const [categories] = await db.query(
      `SELECT tc.id, tc.category_id, cat.name 
       FROM trip_categories tc 
       JOIN categories cat ON tc.category_id = cat.id 
       WHERE tc.trip_id = ?`,
      [id]
    );
    const parsedCategories = categories.map((cat) => ({
      ...cat,
      name: parseJson(cat.name, {}),
    }));

    // ✅ جلب الـ includes
    const [includes] = await db.query(
      `SELECT id, include_translations 
       FROM includes WHERE trip_id = ?`,
      [id]
    );
    const parsedIncludes = includes.map((inc) => ({
      ...inc,
      include_translations:
        parseJson(inc.include_translations, {}),
    }));

    // ✅ جلب الـ exclusions
    const [exclusions] = await db.query(
      `SELECT id, exclusions_translations 
       FROM exclusions WHERE trip_id = ?`,
      [id]
    );
    const parsedExclusions = exclusions.map((exc) => ({
      ...exc,
      exclusions_translations:
        parseJson(exc.exclusions_translations, {}),
    }));

    // ✅ جلب الأيام والأنشطة
    const [days] = await db.query(
      `SELECT id, day_number 
       FROM trip_days WHERE trip_id = ?`,
      [id]
    );
    for (const day of days) {
      const [activities] = await db.query(
        `SELECT id, time, activity_translations 
         FROM day_activities WHERE day_id = ?`,
        [day.id]
      );
      day.activities = activities.map((act) => ({
        ...act,
        activity_translations: parseJson(act.activity_translations, {}),
      }));
    }

    // ✅ جلب تفاصيل الرحلة (trip_details)
    const [details] = await db.query(
      `SELECT id, option_key, translations, detail_values 
       FROM trip_details WHERE trip_id = ?`,
      [id]
    );
    const parsedDetails = details.map((d) => ({
      ...d,
      translations: parseJson(d.translations, {}),
      detail_values: parseJson(d.detail_values, {}),
    }));

    const [reviews] = await db.query(
      `SELECT id, trip_id, user_id, rating, comment, name, avatar_url, time, created_at
       FROM reviews WHERE trip_id = ? ORDER BY created_at DESC`,
      [id],
    );

    return NextResponse.json(
      {
        success: true,
        trip: {
          ...trip,
          title: parseJson(trip.title, {}),
          description: parseJson(trip.description, {}),
          gallery_images: normalizeGalleryImages(trip.gallery_images),
          cover_image: toPublicImageUrl(trip.cover_image),
          solo_price: Number(trip.solo_price || 0),
          group_price: Number(trip.group_price || 0),
          duration: Number(trip.duration || 0),
          discountPercent: Number(trip.discount_percent || 0),
          cities: parsedCities,
          categories: parsedCategories,
          includes: parsedIncludes,
          exclusions: parsedExclusions,
          itinerary: days,
          trip_details: parsedDetails,
          reviews,
          review_count: reviews.length,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ [GET] Exception:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// ================== PUT ==================
export async function PUT(req, context) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  let db;
  try {
    const { id } = await context.params;
    const body = await req.json();
    const pool = await connectDB();
    db = await pool.getConnection();
    await db.beginTransaction();

    // ✅ تحديث بيانات الرحلة الأساسية
    await db.query(
      `UPDATE trips SET 
        title = ?, description = ?, currency = ?, solo_price = ?, group_price = ?,
        duration = ?, duration_unit = ?, priceLevel = ?, cover_image = ?, gallery_images = ?, discount_percent = ?
       WHERE id = ?`,
      [
        JSON.stringify(body.title),
        JSON.stringify(body.description),
        body.currency || "USD",
        Number(body.solo_price),
        Number(body.group_price),
        body.duration,
        body.duration_unit || "days",
        body.priceLevel,
        body.cover_image,
        JSON.stringify(normalizeGalleryImages(body.gallery_images)),
        String(body.discountPercent ?? "0"),
        id,
      ]
    );

    // ✅ تحديث الفئات
    if (Array.isArray(body.categories)) {
      await db.query("DELETE FROM trip_categories WHERE trip_id = ?", [id]);
      for (const catId of body.categories) {
        await db.query(
          "INSERT INTO trip_categories (id, trip_id, category_id) VALUES (?, ?, ?)",
          [uuidv4(), id, catId]
        );
      }
    }

    // ✅ تحديث المدن
    if (Array.isArray(body.cities)) {
      await db.query("DELETE FROM trip_cities WHERE trip_id = ?", [id]);
      for (const cityId of body.cities) {
        await db.query(
          "INSERT INTO trip_cities (id, trip_id, city_id) VALUES (?, ?, ?)",
          [uuidv4(), id, cityId]
        );
      }
    }

    // ✅ تحديث الـ includes
    if (Array.isArray(body.includes)) {
      await db.query("DELETE FROM includes WHERE trip_id = ?", [id]);
      for (const inc of body.includes) {
        await db.query(
          "INSERT INTO includes (id, trip_id, include_translations) VALUES (?, ?, ?)",
          [uuidv4(), id, JSON.stringify(inc.include_translations)]
        );
      }
    }

    // ✅ تحديث الـ exclusions
    if (Array.isArray(body.exclusions)) {
      await db.query("DELETE FROM exclusions WHERE trip_id = ?", [id]);
      for (const exc of body.exclusions) {
        await db.query(
          "INSERT INTO exclusions (id, trip_id, exclusions_translations) VALUES (?, ?, ?)",
          [uuidv4(), id, JSON.stringify(exc.exclusions_translations)]
        );
      }
    }

    // Replace the complete itinerary snapshot so removed days and activities
    // cannot remain orphaned in the database.
    if (Array.isArray(body.itinerary)) {
      const [existingDays] = await db.query("SELECT id FROM trip_days WHERE trip_id = ?", [id]);
      for (const day of existingDays) {
        await db.query("DELETE FROM day_activities WHERE day_id = ?", [day.id]);
      }
      await db.query("DELETE FROM trip_days WHERE trip_id = ?", [id]);

      for (const [index, day] of body.itinerary.entries()) {
        const newDayId = uuidv4();
        await db.query(
          "INSERT INTO trip_days (id, trip_id, day_number) VALUES (?, ?, ?)",
          [newDayId, id, Number(day.day_number) || index + 1]
        );
        for (const act of Array.isArray(day.activities) ? day.activities : []) {
          await db.query(
            "INSERT INTO day_activities (id, day_id, time, activity_translations) VALUES (?, ?, ?, ?)",
            [uuidv4(), newDayId, act.time || null, JSON.stringify(act.activity_translations || {})]
          );
        }
      }
    }

    // ✅ تحديث تفاصيل الرحلة (trip_details)
    if (Array.isArray(body.details)) {
      await db.query("DELETE FROM trip_details WHERE trip_id = ?", [id]);
      for (const detail of body.details) {
        await db.query(
          "INSERT INTO trip_details (id, trip_id, option_key, translations, detail_values) VALUES (?, ?, ?, ?, ?)",
          [
            uuidv4(),
            id,
            detail.option_key,
            JSON.stringify(detail.translations),
            JSON.stringify(detail.detail_values),
          ]
        );
      }
    }

    await db.commit();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    if (db) {
      try { await db.rollback(); } catch (rollbackError) { console.error("Rollback failed:", rollbackError.message); }
    }
    console.error("❌ [PUT] Exception:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  } finally {
    if (db) db.release();
  }
}

// ================== DELETE ==================
export async function DELETE(req, context) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  try {
    const { id } = await context.params;
    const db = await connectDB();

    // Remove dependent records first so reviews and purchases cannot leave
    // orphaned rows or block the trip deletion through foreign keys.
    const [reviews] = await db.query("SELECT id FROM reviews WHERE trip_id = ?", [id]);
    for (const review of reviews) {
      await db.query("DELETE FROM review_likes WHERE review_id = ?", [review.id]);
    }
    await db.query("DELETE FROM reviews WHERE trip_id = ?", [id]);
    await db.query("DELETE FROM purchases WHERE trip_id = ?", [id]);

    // ✅ جلب الأيام المرتبطة بالرحلة
    const [days] = await db.query("SELECT id FROM trip_days WHERE trip_id = ?", [id]);
    for (const day of days) {
      // ✅ حذف الأنشطة المرتبطة بكل يوم
      await db.query("DELETE FROM day_activities WHERE day_id = ?", [day.id]);
    }

    // ✅ حذف المدن المرتبطة بالرحلة
    await db.query("DELETE FROM trip_cities WHERE trip_id = ?", [id]);

    // ✅ حذف التصنيفات المرتبطة بالرحلة
    await db.query("DELETE FROM trip_categories WHERE trip_id = ?", [id]);

    // ✅ حذف الـ includes
    await db.query("DELETE FROM includes WHERE trip_id = ?", [id]);

    // ✅ حذف الـ exclusions
    await db.query("DELETE FROM exclusions WHERE trip_id = ?", [id]);

    // ✅ حذف الأيام
    await db.query("DELETE FROM trip_days WHERE trip_id = ?", [id]);

    // ✅ حذف تفاصيل الرحلة (trip_details)
    await db.query("DELETE FROM trip_details WHERE trip_id = ?", [id]);

    // ✅ حذف الرحلة نفسها
    await db.query("DELETE FROM trips WHERE id = ?", [id]);

    return NextResponse.json(
      { success: true, message: "Trip and all related data deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ [DELETE] Exception:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
