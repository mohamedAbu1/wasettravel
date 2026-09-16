// file: app/api/auth/register/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ روابط الصور المخزنة على هوستنجر (iamges)
const maleAvatars = [
  "https://wasettravel.com/iamges/3d-avatar-cartoon-character_113255-93687.webp",
  "https://wasettravel.com/iamges/blds.webp",
  "https://wasettravel.com/iamges/kbj.webp",
  "https://wasettravel.com/iamges/klhasd.webp",
  "https://wasettravel.com/iamges/memoji-happy-man-white-background-emoji_826801-6839.webp",
  "https://wasettravel.com/iamges/nss.webp",
  "https://wasettravel.com/iamges/technical-writer-digital-avatar-generative-ai_934475-9098.webp",
  "https://wasettravel.com/iamges/3d-avatar-cartoon-character_113255-92170.webp",
  "https://wasettravel.com/iamges/usa.webp",
];

const femaleAvatars = [
  "https://wasettravel.com/iamges/3d-rendered-photo-woman-wearing-glasses-smiles-camera_1103059-4106.webp",
  "https://wasettravel.com/iamges/3d-rendered-photo-woman-wearing-glasses-smiles-camera_1103059-4231.webp",
  "https://wasettravel.com/iamges/3d-rendered-photo-woman-wearing-glasses-smiles-camera_1103059-4319.webp",
  "https://wasettravel.com/iamges/3d-rendered-photo-woman-wearing-glasses-smiles-camera_1103059-4400.webp",
  "https://wasettravel.com/iamges/bjlsd.webp",
  "https://wasettravel.com/iamges/business-woman-3d-cartoon-avatar-portrait_839035-196331.webp",
  "https://wasettravel.com/iamges/klnsd.webp",
  "https://wasettravel.com/iamges/woman-human-head-illustration_862994-10854.webp",
  "https://wasettravel.com/iamges/young-business-woman-with-nerd-glasses-grey-background-3d-rendering_1026950-41027.webp",
  "https://wasettravel.com/iamges/young-smiling-woman-mia-avatar-3d-vector-people-character-illustration-cartoon-minimal-style_1029476-291545.webp",
];

// ✅ دالة لاختيار صورة عشوائية حسب الجنس
function getAvatarByGender(gender) {
  if (gender?.toLowerCase() === "male") {
    return maleAvatars[Math.floor(Math.random() * maleAvatars.length)];
  } else if (gender?.toLowerCase() === "female") {
    return femaleAvatars[Math.floor(Math.random() * femaleAvatars.length)];
  }
  return "https://wasettravel.com/avatars/default/default.webp";
}

export async function POST(request) {
  try {

    const db = await connectDB();

    const body = await request.json();

    const { name, email, password, gender } = body;
    const normalizedName = typeof name === "string" ? name.trim() : "";
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const normalizedGender = typeof gender === "string" ? gender.trim().toLowerCase() : "";

    if (!normalizedName || normalizedName.length > 100 || !/^[\p{L}\p{M}\p{N}\s.'-]+$/u.test(normalizedName)) {
      return NextResponse.json({ error: "الاسم غير صالح" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json({ error: "البريد الإلكتروني غير صالح" }, { status: 400 });
    }
    if (!["male", "female"].includes(normalizedGender)) {
      return NextResponse.json({ error: "يرجى اختيار النوع" }, { status: 400 });
    }

    // ✅ تحقق من قوة كلمة المرور
    if (typeof password !== "string" || password.length < 8 || password.length > 128) {
      return NextResponse.json(
        { error: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" },
        { status: 400 }
      );
    }

    // ✅ تحقق من البريد إذا كان موجود مسبقًا (case-insensitive)
    const [existing] = await db.query(
      "SELECT * FROM users WHERE LOWER(email) = LOWER(?)",
      [normalizedEmail]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "هذا البريد مسجل مسبقًا، يرجى استخدام بريد آخر" },
        { status: 400 }
      );
    }

    // ✅ تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ اختيار صورة عشوائية
    const avatarUrl = getAvatarByGender(normalizedGender);

    // ✅ إدخال المستخدم في قاعدة البيانات
    await db.query(
      "INSERT INTO users (id, name, email, password, gender, role, avatar_url, status, created_at, updated_at) VALUES (UUID(), ?, ?, ?, ?, ?, ?, 'ACTIVE', NOW(), NOW())",
      [normalizedName, normalizedEmail, hashedPassword, normalizedGender, "USER", avatarUrl]
    );

    // ✅ جلب بيانات المستخدم الجديد
    const [rows] = await db.query("SELECT * FROM users WHERE LOWER(email) = LOWER(?)", [email]);
    const newUser = rows[0];

    // ✅ إنشاء JWT token
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const tokenPayload = { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name, avatar_url: newUser.avatar_url, gender: newUser.gender };
    const accessToken = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    const refreshToken = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: "30d" });

    const response = NextResponse.json(
      {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          gender: newUser.gender,
          avatar_url: newUser.avatar_url,
          role: newUser.role,
          status: newUser.status,
        },
      },
      { status: 201 }
    );
    const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 };
    response.cookies.set("token", accessToken, cookieOptions);
    response.cookies.set("access-token", accessToken, cookieOptions);
    response.cookies.set("refresh-token", refreshToken, cookieOptions);
    return response;
  } catch (e) {
    console.error("❌ [API REGISTER] خطأ داخلي:", e);
    return NextResponse.json({ error: "خطأ داخلي" }, { status: 500 });
  }
}
