// file: app/api/auth/me/route.js
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/admin";

export async function GET(request) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    return NextResponse.json({ user }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
