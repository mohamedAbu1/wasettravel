// app/api/reviews/[id]/like/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// استخراج المستخدم من الكوكيز
function getUserFromCookies() {
  console.log("📌 Step 1: قراءة الكوكيز...");
  const cookieStore = cookies(); // ✅ بدون await
  const token = cookieStore.get("my_token")?.value;
  console.log("📌 Step 2: قيمة التوكن:", token);

  if (!token) {
    console.log("❌ لا يوجد توكن");
    return null;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    console.log("📌 Step 3: المستخدم بعد فك التوكن:", user);
    return user;
  } catch (err) {
    console.error("❌ خطأ في التوكن:", err.message);
    return null;
  }
}

export async function POST(req, { params }) {
  console.log("➡️ POST /like بدأ التنفيذ");
  const user = getUserFromCookies(); // ✅ بدون await
  if (!user) {
    console.log("❌ المستخدم غير مصرح");
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const reviewId = params.id;
  console.log("📌 Step 4: reviewId:", reviewId);

  const { error } = await supabase
    .from("review_likes")
    .insert([{ review_id: reviewId, user_id: user.id }]);

  if (error) {
    console.error("❌ خطأ من Supabase:", error.message);
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  console.log("✅ اللايك اتسجل بنجاح");
  return NextResponse.json({ ok: true, message: "Like added successfully" });
}

export async function DELETE(req, { params }) {
  console.log("➡️ DELETE /like بدأ التنفيذ");
  const user = getUserFromCookies(); // ✅ بدون await
  if (!user) {
    console.log("❌ المستخدم غير مصرح");
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const reviewId = params.id;
  console.log("📌 Step 4: reviewId:", reviewId);

  const { error } = await supabase
    .from("review_likes")
    .delete()
    .eq("review_id", reviewId)
    .eq("user_id", user.id);

  if (error) {
    console.error("❌ خطأ من Supabase:", error.message);
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  console.log("✅ اللايك اتشال بنجاح");
  return NextResponse.json({ ok: true, message: "Like removed successfully" });
}

export async function GET(req, { params }) {
  console.log("➡️ GET /like بدأ التنفيذ");
  const reviewId = params.id;
  console.log("📌 Step 1: reviewId:", reviewId);

  const { count, error } = await supabase
    .from("review_likes")
    .select("id", { count: "exact", head: true })
    .eq("review_id", reviewId);

  if (error) {
    console.error("❌ خطأ من Supabase:", error.message);
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  console.log("✅ عدد اللايكات:", count);
  return NextResponse.json({ ok: true, count: count || 0 });
}
