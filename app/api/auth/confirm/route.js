import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login?error=missing_token", req.url));
  }

  try {
    // تحقق من التوكين (JWT أو UUID) حسب ما تولده وقت التسجيل
    const { data, error } = await supabase.auth.verifyOtp({
      type: "signup",
      token,
    });

    if (error || !data) {
      return NextResponse.redirect(new URL("/login?error=invalid_token", req.url));
    }

    // ✅ تحديث حالة المستخدم في قاعدة البيانات
    // مثلاً: confirmed = true

    return NextResponse.redirect(new URL("/login?confirmed=true", req.url));
  } catch (err) {
    return NextResponse.redirect(new URL("/login?error=server", req.url));
  }
}
