import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET(req, context) {
  try {
    const { id } = context.params;

    const db = await connectDB();
    const [rows] = await db.query(`SELECT * FROM trips WHERE id = ? LIMIT 1`, [
      id,
    ]);

    if (!rows.length) {
      return NextResponse.json(
        { success: false, error: "Trip not found" },
        { status: 404 },
      );
    }

    const trip = rows[0];

    // ✅ جلب المدن
    const [cities] = await db.query(
      `SELECT tc.city_id, c.name 
       FROM trip_cities tc 
       JOIN cities c ON tc.city_id = c.id 
       WHERE tc.trip_id = ?`,
      [id],
    );

    // تحويل الاسم من JSON string إلى object
    const parsedCities = cities.map((c) => ({
      ...c,
      name: typeof c.name === "string" ? JSON.parse(c.name) : c.name,
    }));

    // ✅ جلب الفئات
    const [categories] = await db.query(
      `SELECT tc.category_id, cat.name 
       FROM trip_categories tc 
       JOIN categories cat ON tc.category_id = cat.id 
       WHERE tc.trip_id = ?`,
      [id],
    );

    // تحويل الاسم من JSON string إلى object
    const parsedCategories = categories.map((cat) => ({
      ...cat,
      name: typeof cat.name === "string" ? JSON.parse(cat.name) : cat.name,
    }));

    // ✅ جلب الـ includes
    const [includes] = await db.query(
      `SELECT id, include_translations 
       FROM includes WHERE trip_id = ?`,
      [id],
    );

    // ✅ جلب الأيام
    const [days] = await db.query(
      `SELECT id, day_number 
       FROM trip_days WHERE trip_id = ?`,
      [id],
    );

    for (const day of days) {
      const [activities] = await db.query(
        `SELECT id, time, activity_translations 
         FROM day_activities WHERE day_id = ?`,
        [day.id],
      );
      day.activities = activities.map((act) => ({
        ...act,
        activity_translations:
          typeof act.activity_translations === "string"
            ? JSON.parse(act.activity_translations)
            : act.activity_translations,
      }));
    }
    const fullTrip = {
      ...trip,
      cities: parsedCities,
      categories: parsedCategories,
      includes,
      itinerary: days,
    };
    return NextResponse.json(
      {
        success: true,
        trip: {
          ...trip,
          cities: parsedCities,
          categories: parsedCategories,
          includes,
          itinerary: days,
        },
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("❌ [GET] Exception:", err.message);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}

// ================== PUT ==================
export async function PUT(req, context) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const db = await connectDB();

    // ✅ تحديث بيانات الرحلة الأساسية
    await db.query(
      `UPDATE trips SET 
        title = ?, description = ?, solo_price = ?, group_price = ?, 
        duration = ?, priceLevel = ?, cover_image = ?, gallery_images = ?
       WHERE id = ?`,
      [
        JSON.stringify(body.title),
        JSON.stringify(body.description),
        Number(body.solo_price),
        Number(body.group_price),
        body.duration,
        body.priceLevel,
        body.cover_image,
        JSON.stringify(body.gallery_images),
        id,
      ],
    );

    // ✅ تحديث الفئات
    await db.query(`DELETE FROM trip_categories WHERE trip_id = ?`, [id]);
    if (Array.isArray(body.categories) && body.categories.length > 0) {
      const categoriesData = body.categories.map((catId) => [id, catId]);
      await db.query(
        "INSERT INTO trip_categories (trip_id, category_id) VALUES ?",
        [categoriesData],
      );
    }

    // ✅ تحديث المدن
    await db.query(`DELETE FROM trip_cities WHERE trip_id = ?`, [id]);
    if (Array.isArray(body.cities) && body.cities.length > 0) {
      const citiesData = body.cities.map((cityId) => [id, cityId]);
      await db.query("INSERT INTO trip_cities (trip_id, city_id) VALUES ?", [
        citiesData,
      ]);
    }

    // ✅ تحديث الـ includes
    await db.query(`DELETE FROM includes WHERE trip_id = ?`, [id]);
    if (Array.isArray(body.includes) && body.includes.length > 0) {
      const includesData = body.includes.map((inc) => [
        id,
        JSON.stringify(inc.include_translations),
      ]);
      await db.query(
        "INSERT INTO includes (trip_id, include_translations) VALUES ?",
        [includesData],
      );
    }

    // ✅ تحديث الأيام والأنشطة
    await db.query(`DELETE FROM trip_days WHERE trip_id = ?`, [id]);
    if (Array.isArray(body.itinerary) && body.itinerary.length > 0) {
      for (const [index, day] of body.itinerary.entries()) {
        const [dayResult] = await db.execute(
          "INSERT INTO trip_days (trip_id, day_number) VALUES (?, ?)",
          [id, day.day_number || index + 1],
        );
        const dayId = dayResult.insertId;

        if (day.activities?.length > 0) {
          const activitiesData = day.activities.map((act) => [
            dayId,
            act.time,
            JSON.stringify(act.activity_translations),
          ]);
          await db.query(
            "INSERT INTO day_activities (day_id, time, activity_translations) VALUES ?",
            [activitiesData],
          );
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("❌ [PUT] Exception:", err.message);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}

// ================== DELETE ==================
export async function DELETE(req, context) {
  try {
    const { id } = context.params;

    const db = await connectDB();

    await db.query("DELETE FROM trip_cities WHERE trip_id = ?", [id]);
    await db.query("DELETE FROM trip_categories WHERE trip_id = ?", [id]);
    await db.query("DELETE FROM includes WHERE trip_id = ?", [id]);
    await db.query("DELETE FROM trip_days WHERE trip_id = ?", [id]);
    await db.query("DELETE FROM day_activities WHERE day_id = ?", [id]);

    await db.query("DELETE FROM trips WHERE id = ?", [id]);

    return NextResponse.json(
      { success: true, message: "Trip deleted successfully" },
      { status: 200 },
    );
  } catch (err) {
    console.error("❌ [DELETE] Exception:", err.message);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}
