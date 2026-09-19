// middleware.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedAdminPattern = /^\/(en|es|fr|de|it|zh)\/admin(?:\/|$)/;

async function isAdminRequest(req) {
  const tokens = [req.cookies.get("token")?.value, req.cookies.get("access-token")?.value].filter(Boolean);
  if (!tokens.length || !process.env.JWT_SECRET) return false;

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  for (const token of tokens) {
    try {
      const { payload } = await jwtVerify(token, secret);
      if (String(payload.role || "").toLowerCase() === "admin") return true;
    } catch {
      // Continue with the other cookie if one token is stale or invalid.
    }
  }
  return false;
}

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const segments = url.pathname.split("/").filter(Boolean);

  if (protectedAdminPattern.test(url.pathname) && !(await isAdminRequest(req))) {
    const locale = segments[0] || "en";
    url.pathname = `/${locale}`;
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Filter state is useful for visitors but should not become a separate
  // indexable URL. Keep the clean /trips page canonical in search results.
  const hasFilterQuery = ["data", "city", "category", "group_price", "popular"].some((key) => url.searchParams.has(key));
  if (hasFilterQuery && url.pathname.match(/^\/(en|es|fr|de|it|zh)\/trips\/?$/)) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, follow");
    return response;
  }

  // استثناء مسارات النظام والملفات الثابتة
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/favicon.ico") ||
    url.pathname.startsWith("/robots.txt") ||
    url.pathname.startsWith("/sitemap.xml") ||
    url.pathname === "/google49366a773d42ea4a.html" ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/assets") ||
    url.pathname.startsWith("/HomePageImage") ||
    url.pathname.startsWith("/Aswan")||
    url.pathname.startsWith("/Fayoum")||
    url.pathname.startsWith("/Luxor")||
    url.pathname.startsWith("/Cairo")||
    url.pathname.startsWith("/Hurghada")||
    url.pathname.startsWith("/Marsa_Alam")||
    url.pathname.startsWith("/Sharm_El_Sheikh")||
    url.pathname.startsWith("/Alexandria")||
    url.pathname.startsWith("/Siwa")||
    url.pathname.startsWith("/Historicaltourism")||
    url.pathname.startsWith("/iamges")||
    url.pathname.startsWith("/avater")
  ) {
    return NextResponse.next();
  }

  // اللغات المدعومة
  const supportedLangs = ["en", "es", "fr", "de", "it", "zh"];

  // Arabic is not part of the available translation bundle yet. Redirect it
  // to the default English storefront instead of allowing a locale 404.
  if (segments[0] === "ar") {
    url.pathname = `/en${segments.length > 1 ? `/${segments.slice(1).join("/")}` : ""}`;
    return NextResponse.redirect(url);
  }

  // اللغة المكتشفة من المتصفح
  const browserLang =
    req.headers.get("accept-language")?.split(",")[0].split("-")[0] || "en";

  // لو أول جزء من المسار مش لغة مدعومة → أضف اللغة المكتشفة
  if (!segments.length) {
    url.pathname = "/en";
    return NextResponse.redirect(url);
  }

  if (!supportedLangs.includes(segments[0])) {
    const langToUse = supportedLangs.includes(browserLang)
      ? browserLang
      : "en";
    url.pathname = `/${langToUse}${url.pathname}`;
    // Rewrite internally so the first request does not pay for a second round trip.
    return NextResponse.rewrite(url);
  }

  // لو اللغة موجودة بالفعل → لا تعمل أي إعادة توجيه
  return NextResponse.next();
}
