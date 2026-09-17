// file: app/api/auth/login/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const db = await connectDB();
    const { email, password } = await request.json();
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!normalizedEmail || typeof password !== "string" || password.length < 8) {
      return NextResponse.json({ error: "بيانات الدخول غير صحيحة" }, { status: 400 });
    }


    // ✅ البحث عن المستخدم
    const [rows] = await db.query("SELECT * FROM users WHERE LOWER(email) = ?", [normalizedEmail]);
    if (rows.length === 0) {
      return NextResponse.json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }, { status: 401 });
    }

    const user = rows[0];

    // Passwords created by the current signup flow are bcrypt hashes. Some
    // legacy/imported accounts may still contain the old plaintext value;
    // accept those once, then migrate them immediately to bcrypt.
    const storedPassword = String(user.password || "");
    const isBcryptHash = /^\$2[aby]\$\d{2}\$/.test(storedPassword);
    const isValid = isBcryptHash
      ? await bcrypt.compare(password, storedPassword)
      : password === storedPassword;
    if (!isValid) {
      return NextResponse.json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }, { status: 401 });
    }

    if (!isBcryptHash) {
      const migratedPassword = await bcrypt.hash(password, 12);
      await db.query(
        "UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?",
        [migratedPassword, user.id],
      );
    }

    // ✅ إنشاء التوكينات
    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      avatar_url: user.avatar_url,
      gender: user.gender,
    };

    const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // ✅ تجهيز الرد بصيغة JSON واضحة للتطبيق
    const response = NextResponse.json(
      {
        message: "تم تسجيل الدخول بنجاح",
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          gender: user.gender,
          avatar_url: user.avatar_url,
        },
      },
      { status: 200 }
    );

    response.cookies.set("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    response.cookies.set("access-token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    response.cookies.set("refresh-token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (e) {
    console.error("💥 Internal error", e);
    return NextResponse.json({ error: "خطأ داخلي" }, { status: 500 });
  }
}
