// file: app/api/auth/login/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { effectiveRole } from "@/lib/auth/admin";

const loginAttempts = new Map();
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 8;

function getClientKey(request, email) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
  return `${ip}:${email}`;
}

function isBlocked(key) {
  const current = loginAttempts.get(key);
  if (!current || Date.now() - current.startedAt >= LOGIN_WINDOW_MS) {
    loginAttempts.set(key, { startedAt: Date.now(), failures: 0 });
    return false;
  }
  return current.failures >= MAX_FAILED_ATTEMPTS;
}

function recordFailure(key) {
  const current = loginAttempts.get(key) || { startedAt: Date.now(), failures: 0 };
  current.failures += 1;
  loginAttempts.set(key, current);
}

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const attemptKey = getClientKey(request, normalizedEmail || "unknown");

    if (isBlocked(attemptKey)) {
      return NextResponse.json({ error: "Too many failed attempts. Try again later." }, { status: 429 });
    }

    if (!normalizedEmail || typeof password !== "string" || password.length < 8) {
      recordFailure(attemptKey);
      return NextResponse.json({ error: "Invalid login details" }, { status: 400 });
    }

    const db = await connectDB();

    // ✅ البحث عن المستخدم
    const [rows] = await db.query("SELECT * FROM users WHERE LOWER(email) = ?", [normalizedEmail]);
    if (rows.length === 0) {
      recordFailure(attemptKey);
      return NextResponse.json({ error: "Email or password is incorrect" }, { status: 401 });
    }

    const user = rows[0];
    const role = effectiveRole(user);

    // Passwords created by the current signup flow are bcrypt hashes. Some
    // legacy/imported accounts may still contain the old plaintext value;
    // accept those once, then migrate them immediately to bcrypt.
    const storedPassword = String(user.password || "");
    const isBcryptHash = /^\$2[aby]\$\d{2}\$/.test(storedPassword);
    const isValid = isBcryptHash
      ? await bcrypt.compare(password, storedPassword)
      : password === storedPassword;
    if (!isValid) {
      recordFailure(attemptKey);
      return NextResponse.json({ error: "Email or password is incorrect" }, { status: 401 });
    }
    loginAttempts.delete(attemptKey);

    if (!isBcryptHash) {
      const migratedPassword = await bcrypt.hash(password, 12);
      await db.query(
        "UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?",
        [migratedPassword, user.id],
      );
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ error: "Authentication is temporarily unavailable" }, { status: 503 });
    }

    // Create the session tokens.
    const tokenPayload = {
      id: user.id,
      email: user.email,
      role,
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

    // The tokens are stored in HttpOnly cookies below. Do not expose the
    // access token to browser JavaScript unnecessarily.
    const response = NextResponse.json(
      {
        message: "Logged in successfully",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role,
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
    return NextResponse.json({ error: "Unable to sign in right now" }, { status: 500 });
  }
}
