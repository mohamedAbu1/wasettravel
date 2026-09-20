// src/app/api/reviews/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { isPrimaryAdmin, requireUser } from "@/lib/auth/admin";

// ✅ GET: جلب تعليق واحد
export async function GET(req, { params }) {
  try {
    const { id: reviewId } = await params;
    const db = await connectDB();

    const [rows] = await db.query("SELECT * FROM reviews WHERE id = ?", [reviewId]);

    if (rows.length === 0) {
      return NextResponse.json({ ok: false, error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, review: rows[0] }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
  }
}

// ✅ DELETE: حذف تعليق
export async function DELETE(req, { params }) {
  const auth = requireUser(req);
  if (auth.response) return auth.response;

  try {
    const { id: reviewId } = await params;
    const db = await connectDB();

    // جلب التعليق للتأكد من وجوده
    const [rows] = await db.query("SELECT id, user_id FROM reviews WHERE id = ?", [reviewId]);
    if (rows.length === 0) {
      return NextResponse.json({ ok: false, error: "Review not found" }, { status: 404 });
    }

    const isAdmin = isPrimaryAdmin(auth.user) || String(auth.user.role || "").trim().toLowerCase() === "admin";
    if (!isAdmin && String(rows[0].user_id) !== String(auth.user.id)) {
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }

    await db.query("DELETE FROM review_likes WHERE review_id = ?", [reviewId]);
    await db.query("DELETE FROM reviews WHERE id = ?", [reviewId]);

    return NextResponse.json({ ok: true, success: true, reviewId, message: "Review deleted successfully" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
  }
}

// ✅ PUT: تعديل تعليق
export async function PUT(req, { params }) {
  try {
    const { id: reviewId } = await params;
    const auth = requireUser(req);
    if (auth.response) return auth.response;
    const body = await req.json();
    const { comment, rating } = body || {};
    const normalizedComment = String(comment || "").trim();
    const normalizedRating = Number(rating);
    if (!normalizedComment || !Number.isInteger(normalizedRating) || normalizedRating < 1 || normalizedRating > 5) {
      return NextResponse.json({ ok: false, error: "Valid comment and rating are required" }, { status: 400 });
    }

    const db = await connectDB();

    // جلب التعليق للتأكد من وجوده
    const [rows] = await db.query("SELECT id, user_id FROM reviews WHERE id = ?", [reviewId]);
    if (rows.length === 0) {
      return NextResponse.json({ ok: false, error: "Review not found" }, { status: 404 });
    }

    const isAdmin = isPrimaryAdmin(auth.user) || String(auth.user.role || "").trim().toLowerCase() === "admin";
    if (!isAdmin && String(rows[0].user_id) !== String(auth.user.id)) {
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }

    await db.query("UPDATE reviews SET comment = ?, rating = ? WHERE id = ?", [normalizedComment, normalizedRating, reviewId]);

    return NextResponse.json({ ok: true, message: "Review updated successfully" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
  }
}
