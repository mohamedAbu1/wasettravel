// src/api/oauth/facebook/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  const redirectTo = `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth/callback`;
  const { data } = await supabase.auth.signInWithOAuth({
    provider: "facebook",
    options: { redirectTo },
  });
  return NextResponse.redirect(data.url);
}
