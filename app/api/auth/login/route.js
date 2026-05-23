import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient"; // ✅ استخدم admin client

export async function POST(request) {
  try {
    // 1️⃣ قراءة البريد وكلمة المرور من الطلب
    const { email, password } = await request.json();
    console.log("📩 Step 1: Received login request", { email });

    // 2️⃣ إنشاء supabase client باستخدام service_role key
    const supabase = supabaseAdmin();
    console.log("🔑 Step 2: Supabase admin client initialized");

    // 3️⃣ محاولة تسجيل الدخول
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log("⚡ Step 3: Supabase signInWithPassword executed");

    // 4️⃣ لو فيه خطأ → رجّع 401
    if (error) {
      console.error("❌ Step 4: Login failed", error.message);
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    // 5️⃣ استخراج بيانات المستخدم والجلسة
    const user = data.user;
    const session = data.session;
    console.log("👤 Step 5: User and session retrieved", { user });

    // 6️⃣ إعداد الرد
    const response = NextResponse.json(
      { message: "تم تسجيل الدخول بنجاح", user, session },
      { status: 200 }
    );
    console.log("📦 Step 6: Response prepared");

    // 7️⃣ تخزين التوكينات في الكوكيز
    response.cookies.set("sb-access-token", session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15, // 15 دقيقة
    });
    console.log("🍪 Step 7a: Access token cookie set");

    response.cookies.set("sb-refresh-token", session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 يوم
    });
    console.log("🍪 Step 7b: Refresh token cookie set");

    // 8️⃣ إرجاع الرد النهائي
    console.log("✅ Step 8: Login successful, returning response");
    return response;
  } catch (e) {
    // 9️⃣ لو حصل خطأ داخلي
    console.error("💥 Step 9: Internal error", e);
    return NextResponse.json({ error: "خطأ داخلي" }, { status: 500 });
  }
}
