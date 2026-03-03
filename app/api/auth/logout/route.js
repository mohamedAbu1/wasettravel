// src/app/api/auth/logout/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies(); // ✅ لازم await هنا

  // امسح التوكنات
  cookieStore.set("sb_access", "", { path: "/", httpOnly: true, maxAge: 0 });
  cookieStore.set("sb_refresh", "", { path: "/", httpOnly: true, maxAge: 0 });

  return NextResponse.json({ ok: true, message: "Logged out successfully" });
}
