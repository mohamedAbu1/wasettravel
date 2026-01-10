// src/lib/cookies.ts
import { cookies } from "next/headers";

export function setSessionCookies(accessToken ,refreshToken) {
  const c = cookies();
  c.set("sb_access", accessToken, {
    httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 15,
  });
  if (refreshToken) {
    c.set("sb_refresh", refreshToken, {
      httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30,
    });
  }
}

export function clearSessionCookies() {
  const c = cookies();
  c.set("sb_access", "", { path: "/", httpOnly: true, maxAge: 0 });
  c.set("sb_refresh", "", { path: "/", httpOnly: true, maxAge: 0 });
}
