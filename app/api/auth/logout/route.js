// src/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { clearSessionCookies } from "@/lib/Cookies";

export async function POST() {
  clearSessionCookies();
  const res = NextResponse.json({ ok: true });
  res.cookies.set("app_jwt", "", { path: "/", httpOnly: true, maxAge: 0 });
  return res;
}
