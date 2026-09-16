import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid"; 
import { notifyAdmins } from "@/lib/notifications";
import { requireUser } from "@/lib/auth/admin";

// ✅ جلب التعليقات
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const tripId = searchParams.get("tripId");

    const db = await connectDB();
    let query = "SELECT * FROM reviews";
    let params = [];

    if (tripId) {
      query += " WHERE trip_id = ?";
      params.push(tripId);
    }

    query += " ORDER BY created_at DESC";

    const [rows] = await db.query(query, params);

    return NextResponse.json({ success: true, reviews: rows }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

// ✅ إضافة تعليق جديد
export async function POST(req) {
    const auth = requireUser(req);
    if (auth.response) return auth.response;
  try {
    console.log("📩 Request received at /api/reviews");

    const body = await req.json();
    console.log("📌 Parsed body:", body);

    const { trip_id, rating, comment, name, avatar_url, time } = body;
    const user_id = auth.user.id;
    console.log("✅ Extracted values:", {
      trip_id,
      user_id,
      rating,
      comment,
      name,
      avatar_url,
      time,
    });

    const db = await connectDB();
    console.log("🔗 Connected to DB successfully");

    const reviewId = uuidv4();
    console.log("🆔 Generated reviewId:", reviewId);

    const query = `
      INSERT INTO reviews 
      (id, trip_id, user_id, rating, comment, name, avatar_url, time, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    const params = [reviewId, trip_id, user_id, rating, comment, name, avatar_url, time];
    console.log("📝 Executing query:", query);
    console.log("📊 With params:", params);

    await db.query(query, params);
    await notifyAdmins(db, { eventType: "review", message: `${name || "A traveler"} submitted a new review`, userId: user_id, userName: name, userImage: avatar_url, tripId: trip_id });
    console.log("✅ Insert successful");

    return NextResponse.json(
      { success: true, review: { id: reviewId, ...body } },
      { status: 201 }
    );
  } catch (err) {
    console.error("💥 Error in POST /api/reviews:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
