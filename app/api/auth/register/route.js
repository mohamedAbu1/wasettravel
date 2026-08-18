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

    // ✅ تحقق من قوة كلمة المرور
    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" },
        { status: 400 }
      );
    }

    // ✅ تحقق من البريد إذا كان موجود مسبقًا (case-insensitive)
    const [existing] = await db.query(
      "SELECT * FROM users WHERE LOWER(email) = LOWER(?)",
      [email]
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
    const avatarUrl = getAvatarByGender(gender);

    // ✅ إدخال المستخدم في قاعدة البيانات
    await db.query(
      "INSERT INTO users (id, name, email, password, gender, role, avatar_url, status, created_at, updated_at) VALUES (UUID(), ?, ?, ?, ?, ?, ?, 'ACTIVE', NOW(), NOW())",
      [name, email, hashedPassword, gender, "USER", avatarUrl]
    );

    // ✅ جلب بيانات المستخدم الجديد
    const [rows] = await db.query("SELECT * FROM users WHERE LOWER(email) = LOWER(?)", [email]);
    const newUser = rows[0];

    // ✅ إنشاء JWT token
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const accessToken = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    console.log("🔵 [API REGISTER] التوكين تم إنشاؤه");

    return NextResponse.json(
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
        accessToken,
      },
      { status: 201 }
    );
  } catch (e) {
    console.error("❌ [API REGISTER] خطأ داخلي:", e);
    return NextResponse.json({ error: "خطأ داخلي" }, { status: 500 });
  }
}