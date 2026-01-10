// app/api/auth/register/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";
import { supabaseAdmin as supabase } from "@/lib/supabaseClient";
import { createSessionCookie } from "@/lib/utils/JWToken";
import { UserSchema } from "@/lib/schemas/userSchema";
import { maleAvatars, femaleAvatars } from "@/constants/images";
// ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

// دالة لاختيار صورة عشوائية حسب الجنس
function getAvatarByGender(gender) {
  // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

  if (gender?.toLowerCase() === "male") {
    return maleAvatars[Math.floor(Math.random() * maleAvatars.length)];
  } else if (gender?.toLowerCase() === "female") {
    return femaleAvatars[Math.floor(Math.random() * femaleAvatars.length)];
  }
  // لو الجنس غير محدد → fallback لصورة عامة
  return "/HomePageImage/default.webp";
}
// ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

export async function POST(request) {
  try {
    // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

    // قراءة البيانات من الطلب
    const body = await request.json();
    console.log("📩 بيانات الطلب:", body);

    // التحقق من صحة البيانات
    const parsed = UserSchema.safeParse(body);
    if (!parsed.success) {
      console.error("❌ فشل التحقق من البيانات:", parsed.error);
      return NextResponse.json(
        { error: "البيانات غير صالحة" },
        { status: 400 }
      );
    }
    // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

    let { name, email, password, gender } = parsed.data;

    // لو كلمة المرور فاضية → نولّد باسورد وهمي
    if (!password || password.trim() === "") {
      password = crypto.randomUUID();
    }
    // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

    // التحقق من وجود المستخدم مسبقًا
    const { data: existing, error: findError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (findError && findError.code !== "PGRST116") {
      console.error("❌ خطأ في البحث:", findError.message);
      return NextResponse.json(
        { error: "فشل التحقق من البريد الإلكتروني" },
        { status: 500 }
      );
    }
    // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

    if (existing) {
      console.warn("⚠️ المستخدم موجود بالفعل:", existing);
      return NextResponse.json(
        { error: "المستخدم موجود بالفعل" },
        { status: 409 }
      );
    }
    // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

    // تشفير كلمة المرور
    const hashed = await bcrypt.hash(password, 10);

    // إدخال المستخدم الجديد
    const { data: inserted, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          name,
          email,
          password: hashed,
          role: "USER",
          isActive: true,
          provider: "local",
          provider_id: email,
          avatar_url: getAvatarByGender(gender),
          gender: gender,
        },
      ])
      .select("id, name, email, role, isActive, provider, avatar_url,gender");

    if (insertError || !inserted?.[0]) {
      console.error("❌ خطأ في الإدخال:", insertError?.message);
      return NextResponse.json(
        { error: "فشل إنشاء المستخدم" },
        { status: 500 }
      );
    }
    // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

    console.log("✅ المستخدم الجديد:", inserted[0]);

    // إنشاء الـ JWT
    const payload = {
      id: inserted[0].id,
      email: inserted[0].email,
      name: inserted[0].name,
      role: inserted[0].role,
      isActive: inserted[0].isActive,
      provider: inserted[0].provider,
      avatar_url: inserted[0].avatar_url,
      gender: inserted[0].gender,
    };
    // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

    // هنا createSessionCookie بيرجع { token, cookie }
    const { token, cookie } = await createSessionCookie(payload);
    console.log("🍪 الكوكيز:", cookie);
    // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

    // الاستجابة النهائية → نرجع user + token
    const res = NextResponse.json({
      message: "تم إنشاء المستخدم بنجاح",
      user: inserted[0],
      token, // علشان الـ client يستخدمه
    });
    res.headers.set("Set-Cookie", cookie);
    return res;
  } catch (e) {
    console.error("❌ خطأ داخلي:", e);
    return NextResponse.json({ error: "خطأ داخلي" }, { status: 500 });
  }
}
