// src/app/api/auth/logout/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const c = cookies();
  c.set("sb_access", "", { path: "/", httpOnly: true, maxAge: 0 });
  c.set("sb_refresh", "", { path: "/", httpOnly: true, maxAge: 0 });

  return NextResponse.json({ ok: true, message: "Logged out successfully" });
}
