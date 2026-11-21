import { connectDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { effectiveRole } from "@/lib/auth/admin";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    const sessionEmail = typeof session?.user?.email === "string" ? session.user.email.trim().toLowerCase() : "";
    if (!sessionEmail) {
      return NextResponse.json({ error: "Google session required" }, { status: 401 });
    }
    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ error: "Authentication is temporarily unavailable" }, { status: 503 });
    }
    const normalizedName = typeof session.user.name === "string" && session.user.name.trim()
      ? session.user.name.trim()
      : sessionEmail.split("@")[0];
    const db = await connectDB();

  const [rows] = await db.query("SELECT id, role, avatar_url FROM users WHERE LOWER(email) = ?", [sessionEmail]);
  let user;

  if (rows.length === 0) {
    const newUserId = uuidv4();
    await db.query(
      "INSERT INTO users (id, email, name, gender, created_at) VALUES (?, ?, ?, ?, NOW())",
      [newUserId, sessionEmail, normalizedName, "unspecified"]
    );
    user = { id: newUserId, email: sessionEmail, name: normalizedName, role: effectiveRole({ email: sessionEmail }), avatar_url: null };
  } else {
    user = { id: rows[0].id, email: sessionEmail, name: normalizedName, role: effectiveRole({ ...rows[0], email: sessionEmail }), avatar_url: rows[0].avatar_url };
  }

    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "30d" });
    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "30d" });
    const response = NextResponse.json({ user });
    const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 };
    response.cookies.set("token", token, cookieOptions);
    response.cookies.set("access-token", token, cookieOptions);
    response.cookies.set("refresh-token", refreshToken, cookieOptions);
    return response;
  } catch (error) {
    console.error("Google authentication sync failed:", error);
    return NextResponse.json({ error: "Unable to complete Google sign-in right now" }, { status: 500 });
  }
}
