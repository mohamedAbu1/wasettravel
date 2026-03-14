// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request) {
  try {
    console.log("📩 استقبلنا طلب تسجيل الدخول");

    const { email, password } = await request.json();
    console.log("✅ البيانات المستلمة:", { email, password });

    // تسجيل الدخول عبر Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("❌ خطأ في تسجيل الدخول:", error.message);
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.log("✅ تسجيل الدخول ناجح:", data);

    const user = data.user;
    const session = data.session;

    console.log("👤 المستخدم:", user);
    console.log("🔑 التوكين:", session?.access_token);

    // حفظ التوكين في الكوكيز
    const response = NextResponse.json({
      message: "تم تسجيل الدخول بنجاح",
      user,
    });

    response.cookies.set("sb_access", session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // فقط في الإنتاج
      sameSite: "lax", // يسمح بالعمل على localhost
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // أسبوع
    });

    console.log("🍪 الكوكيز sb_access تم إنشاؤه");

    return response;
  } catch (e) {
    console.error("💥 خطأ داخلي:", e);
    return NextResponse.json({ error: "خطأ داخلي" }, { status: 500 });
  }
}
