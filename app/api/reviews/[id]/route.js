// src/app/api/reviews/[id]/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

// استخراج المستخدم من الكوكيز
async function getUserFromCookies() {
  const cookieStore = await cookies(); // ✅ بدون await
  const token = cookieStore.get("sb_access")?.value;

  if (!token) return null;

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return user; // لازم يحتوي على id أو sub + role
  } catch (err) {
    console.error("❌ خطأ في التوكن:", err.message);
    return null;
  }
}

export async function GET(req, { params }) {
  const tripId = params.tripId;
  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("trip_id", tripId)
    .order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 400 },
    );
  }
  return NextResponse.json({ ok: true, reviews });
}

export async function DELETE(req) {
  const user = await getUserFromCookies();
  if (!user) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  // استخراج الـ id من الـ URL مباشرة
  const { pathname } = new URL(req.url);
  const reviewId = pathname.split("/").pop(); // آخر جزء من الـ URL

  const { data: review, error: fetchError } = await supabase
    .from("reviews")
    .select("id, user_id")
    .eq("id", reviewId)
    .single();

  if (fetchError || !review) {
    return NextResponse.json(
      { ok: false, error: "Review not found" },
      { status: 404 },
    );
  }

  const userId = user.id || user.sub;
  if (user.role !== "ADMIN" && userId !== review.user_id) {
    return NextResponse.json(
      { ok: false, error: "Forbidden" },
      { status: 403 },
    );
  }

  const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Review deleted successfully",
  });
}
// ✏️ PUT: تعديل التعليق
export async function PUT(req) {
  const user = await getUserFromCookies();
  if (!user) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { pathname } = new URL(req.url);
  const reviewId = pathname.split("/").pop();

  const body = await req.json();
  const { comment, rating } = body;

  const { data: review, error: fetchError } = await supabase
    .from("reviews")
    .select("id, user_id")
    .eq("id", reviewId)
    .single();

  if (fetchError || !review) {
    return NextResponse.json(
      { ok: false, error: "Review not found" },
      { status: 404 },
    );
  }

  const userId = user.id || user.sub;
  if (userId !== review.user_id) {
    return NextResponse.json(
      { ok: false, error: "Forbidden" },
      { status: 403 },
    );
  }

  const { error } = await supabase
    .from("reviews")
    .update({ comment, rating })
    .eq("id", reviewId);

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Review updated successfully",
  });
}
