import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireUser } from "@/lib/auth/admin";
import { notifyAdmins } from "@/lib/notifications";

// ✅ جلب اللايكات
export async function GET(request, { params }) {
  try {
    const { id: reviewId } = await params;

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
    await db.query(
      "INSERT INTO review_likes (review_id, user_id, created_at) VALUES (?, ?, NOW())",
      [reviewId, user_id]
    );
    const [reviewRows] = await db.query("SELECT trip_id FROM reviews WHERE id = ?", [reviewId]);
    if (reviewRows[0]) await notifyAdmins(db, { eventType: "review_like", message: `${auth.user.name || "A traveler"} liked a review`, userId: auth.user.id, userName: auth.user.name, userEmail: auth.user.email, tripId: reviewRows[0].trip_id });

    return NextResponse.json({ ok: true, message: "Like added successfully" }, { status: 201 });
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

    const user_id = auth.user.id;

    const db = await connectDB();
    await db.query(
      "DELETE FROM review_likes WHERE review_id = ? AND user_id = ?",
      [reviewId, user_id]
    );

    return NextResponse.json({ ok: true, message: "Like removed successfully" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
  }
}
