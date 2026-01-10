// app/api/auth/oauth/[provider]/start/route.js
import { NextResponse } from "next/server";

const providers = {
  google: {
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    scope: "openid email profile",
  },
  facebook: {
    authUrl: "https://www.facebook.com/v17.0/dialog/oauth",
    scope: "public_profile,email",
  },
};

export async function GET(request, { params }) {
  const { provider } = params;
  const config = providers[provider];
  if (!config) return NextResponse.json({ error: "مزود غير مدعوم" }, { status: 400 });

  const redirectUri = process.env.OAUTH_REDIRECT_URL; // /api/auth/oauth/callback
  const clientId =
    provider === "google" ? process.env.GOOGLE_CLIENT_ID : process.env.FACEBOOK_CLIENT_ID;

  const state = crypto.randomUUID();
  const url = new URL(config.authUrl);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", config.scope);
  url.searchParams.set("state", state);

  if (provider === "google") {
    url.searchParams.set("access_type", "online");
    url.searchParams.set("include_granted_scopes", "true");
    url.searchParams.set("prompt", "consent"); // اختياري
  }

  return NextResponse.redirect(url.toString());
}
