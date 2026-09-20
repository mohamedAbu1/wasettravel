import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { connectDB } from "@/lib/db";
import { requireUser } from "@/lib/auth/admin";
import { notifyAdmins } from "@/lib/notifications";

// ✅ جلب اللايكات
export async function GET(request, { params }) {
  try {
    const { id: reviewId } = await params;
    if (!reviewId) return NextResponse.json({ ok: false, error: "Review id is required" }, { status: 400 });

    const db = await connectDB();
    const [rows] = await db.query(
      "SELECT user_id FROM review_likes WHERE review_id = ?",
      [reviewId]
    );

    return NextResponse.json({
      ok: true,
      count: rows.length,
      users: rows.map((r) => r.user_id),
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
  }
}

// ✅ إضافة لايك
export async function POST(request, { params }) {
    const auth = requireUser(request);
    if (auth.response) return auth.response;
  try {
    const { id: reviewId } = await params;

    const user_id = auth.user.id;

    const db = await connectDB();
    const [reviewRows] = await db.query("SELECT id, trip_id FROM reviews WHERE id = ? LIMIT 1", [reviewId]);
    if (!reviewRows.length) return NextResponse.json({ ok: false, error: "Review not found" }, { status: 404 });
    const [existingRows] = await db.query(
      "SELECT user_id FROM review_likes WHERE review_id = ? AND user_id = ? LIMIT 1",
      [reviewId, user_id],
    );
    if (existingRows.length > 0) {
      const [likeRows] = await db.query(
        "SELECT user_id FROM review_likes WHERE review_id = ?",
        [reviewId],
      );
      return NextResponse.json({
        ok: true,
        alreadyLiked: true,
        count: likeRows.length,
        users: likeRows.map((row) => row.user_id),
      });
    }
    await db.query(
      "INSERT INTO review_likes (id, review_id, user_id, created_at) VALUES (?, ?, ?, NOW())",
      [uuidv4(), reviewId, user_id]
    );
    const [likeRows] = await db.query(
      "SELECT user_id FROM review_likes WHERE review_id = ?",
      [reviewId],
    );
    if (reviewRows[0]) await notifyAdmins(db, { eventType: "review_like", message: `${auth.user.name || "A traveler"} liked a review`, userId: auth.user.id, userName: auth.user.name, userEmail: auth.user.email, tripId: reviewRows[0].trip_id });

    return NextResponse.json({ ok: true, count: likeRows.length, users: likeRows.map((row) => row.user_id), message: "Like added successfully" }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
  }
}

// ✅ إزالة لايك
export async function DELETE(request, { params }) {
    const auth = requireUser(request);
    if (auth.response) return auth.response;
  try {
    const { id: reviewId } = await params;
    if (!reviewId) return NextResponse.json({ ok: false, error: "Review id is required" }, { status: 400 });

    const user_id = auth.user.id;

    const db = await connectDB();
    await db.query(
      "DELETE FROM review_likes WHERE review_id = ? AND user_id = ?",
      [reviewId, user_id]
    );
    const [likeRows] = await db.query(
      "SELECT user_id FROM review_likes WHERE review_id = ?",
      [reviewId],
    );

    return NextResponse.json({ ok: true, count: likeRows.length, users: likeRows.map((row) => row.user_id), message: "Like removed successfully" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
  }
}
