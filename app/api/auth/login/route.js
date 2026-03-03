// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // ✅ تسجيل الدخول عبر Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    // ✅ لو نجح تسجيل الدخول
    const user = data.user;
    const session = data.session;

    // ✅ الاستجابة النهائية
    return NextResponse.json({
      message: "تم تسجيل الدخول بنجاح",
      user,
      session,
    });
  } catch (e) {
    console.error("Login error:", e);
    return NextResponse.json({ error: "خطأ داخلي" }, { status: 500 });
  }
}
