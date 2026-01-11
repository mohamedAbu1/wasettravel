import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createSessionCookie } from "@/lib/utils/JWToken";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // ابحث عن المستخدم
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, password, name, role, avatar_url, isActive, provider")
      .eq("email", email)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: "المستخدم غير موجود" },
        { status: 404 }
      );
    }

    // تحقق من كلمة المرور
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    // أنشئ التوكين والكوكيز للجلسة
    const { token, cookie } = await createSessionCookie({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar_url: user.avatar_url, // ✅ أضفها هنا
    });

    // أرسل التوكين والبيانات
    const res = NextResponse.json({
      message: "تم تسجيل الدخول بنجاح",
      user,
      token, // علشان نخزنه في localStorage بالـ client
    });

    // ضبط الكوكيز في الـ headers
    res.headers.set("Set-Cookie", cookie);
    return res;
  } catch (e) {
    console.error("Login error:", e);
    return NextResponse.json({ error: "خطأ داخلي" }, { status: 500 });
  }
}
