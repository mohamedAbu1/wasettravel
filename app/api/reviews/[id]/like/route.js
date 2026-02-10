import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

async function getUserFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sb_access")?.value;
  if (!token) return null;

  try {
    // ✅ فك التوكن مباشرة من الكوكيز
    const decoded = jwt.decode(token);

    return decoded || null;
  } catch (err) {
    console.error("JWT decode error:", err.message);
    return null;
  }
}

// 🟢 إضافة لايك
export async function POST(req) {
  const user = await getUserFromCookies();
  if (!user?.id) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  const reviewId = segments[segments.indexOf("reviews") + 1];

  if (!reviewId) {
    return NextResponse.json(
      { ok: false, error: "Missing reviewId" },
      { status: 400 },
    );
  }


  const { error } = await supabase
    .from("review_likes")
    .insert([{ review_id: reviewId, user_id: user.id }]);

  if (error) {
    console.error("Supabase error (POST):", error.message);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true, message: "Like added successfully" });
}

// 🔴 إزالة لايك
export async function DELETE(req) {
  const user = await getUserFromCookies();
  if (!user?.id) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  const reviewId = segments[segments.indexOf("reviews") + 1];

  if (!reviewId) {
    return NextResponse.json(
      { ok: false, error: "Missing reviewId" },
      { status: 400 },
    );
  }


  const { error } = await supabase
    .from("review_likes")
    .delete()
    .eq("review_id", reviewId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Supabase error (DELETE):", error.message);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true, message: "Like removed successfully" });
}

// 📊 جلب عدد اللايكات + قائمة المستخدمين
export async function GET(req) {
  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  const reviewId = segments[segments.indexOf("reviews") + 1];

  if (!reviewId) {
    return NextResponse.json(
      { ok: false, error: "Missing reviewId" },
      { status: 400 },
    );
  }


  const { data, error } = await supabase
    .from("review_likes")
    .select("user_id")
    .eq("review_id", reviewId);

  if (error) {
    console.error("Supabase error (GET):", error.message);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    count: data?.length || 0,
    users: data?.map((d) => d.user_id) || [],
  });
}
