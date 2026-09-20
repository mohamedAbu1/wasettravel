import { connectDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { effectiveRole } from "@/lib/auth/admin";

export async function POST(req) {
  const { email, name } = await req.json();
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  const db = await connectDB();

  const [rows] = await db.query("SELECT id, role, avatar_url FROM users WHERE LOWER(email) = ?", [normalizedEmail]);
  let user;

  if (rows.length === 0) {
    const newUserId = uuidv4();
    await db.query(
      "INSERT INTO users (id, email, name, gender, created_at) VALUES (?, ?, ?, ?, NOW())",
      [newUserId, normalizedEmail, name || normalizedEmail.split("@")[0], "unspecified"]
    );
    user = { id: newUserId, email: normalizedEmail, name: name || normalizedEmail.split("@")[0], role: effectiveRole({ email: normalizedEmail }), avatar_url: null };
  } else {
    user = { id: rows[0].id, email: normalizedEmail, name, role: effectiveRole({ ...rows[0], email: normalizedEmail }), avatar_url: rows[0].avatar_url };
  }

  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "30d" });
  const response = NextResponse.json({ user, accessToken: token });
  response.cookies.set("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  response.cookies.set("access-token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return response;
}
