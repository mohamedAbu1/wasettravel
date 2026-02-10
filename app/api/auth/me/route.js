// app/api/auth/me/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sb_access")?.value;
  if (!token) return NextResponse.json({ user: null });

  try {
    const decoded = jwt.decode(token);
    return NextResponse.json({ user: decoded || null });
  } catch (err) {
    console.error("JWT decode error:", err.message);
    return NextResponse.json({ user: null });
  }
}
