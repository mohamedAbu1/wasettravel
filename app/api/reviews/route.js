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
    const body = await req.json();
    const { trip_id, rating, comment, name, avatar_url, time } = body || {};
    const user_id = auth.user.id;

    const normalizedComment = String(comment || "").trim();
    const normalizedRating = Number(rating);
    if (!trip_id || !normalizedComment) {
      return NextResponse.json({ success: false, error: "Trip and comment are required" }, { status: 400 });
    }
    if (!Number.isInteger(normalizedRating) || normalizedRating < 1 || normalizedRating > 5) {
      return NextResponse.json({ success: false, error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    const db = await connectDB();
    const [trips] = await db.query("SELECT id FROM trips WHERE id = ? LIMIT 1", [trip_id]);
    if (!trips.length) {
      return NextResponse.json({ success: false, error: "Trip not found" }, { status: 404 });
    }

    const reviewId = uuidv4();
    const normalizedName = String(name || auth.user.name || auth.user.email || "Traveler").trim();
    const normalizedAvatar = String(avatar_url || auth.user.avatar_url || auth.user.image || "/default-avatar.png").trim();
    const normalizedTime = String(time || new Date().toLocaleTimeString()).trim();
    const query = `
      INSERT INTO reviews 
      (id, trip_id, user_id, rating, comment, name, avatar_url, time, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    await db.query(query, [reviewId, trip_id, user_id, normalizedRating, normalizedComment, normalizedName, normalizedAvatar, normalizedTime]);
    await notifyAdmins(db, { eventType: "review", message: `${name || "A traveler"} submitted a new review`, userId: user_id, userName: name, userImage: avatar_url, tripId: trip_id });

    return NextResponse.json(
      { success: true, review: { id: reviewId, trip_id, user_id, rating: normalizedRating, comment: normalizedComment, name: normalizedName, avatar_url: normalizedAvatar, time: normalizedTime, created_at: new Date().toISOString() } },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error in POST /api/reviews:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
