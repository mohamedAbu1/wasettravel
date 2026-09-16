// file: app/api/auth/me/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    const tokens = [request.cookies.get("token")?.value, request.cookies.get("access-token")?.value].filter(Boolean);

    if (!tokens.length) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    let decoded = null;
    for (const token of tokens) {
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        break;
      } catch {
        // Try the other supported cookie before declaring the session invalid.
      }
    }
    if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    return NextResponse.json({ user: decoded }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
