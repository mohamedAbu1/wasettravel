import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    const user = data.user;
    const session = data.session;

    const response = NextResponse.json(
      { message: "تم تسجيل الدخول بنجاح", user, session },
      { status: 200 }
    );

    // ✅ أسماء الكوكيز الصحيحة
    response.cookies.set("sb-access-token", session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    response.cookies.set("sb-refresh-token", session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (e) {
    return NextResponse.json({ error: "خطأ داخلي" }, { status: 500 });
  }
}
