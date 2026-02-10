import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/utils/JWToken";

export async function GET() {
  console.log("📌 [API] Purchases route called");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  console.log("✅ Supabase client created");

  const cookieStore = await cookies();
  const access_token = cookieStore.get("sb_access")?.value;
  console.log("📌 Access token from cookies:", access_token);

  if (!access_token) {
    console.warn("⚠️ No access token found, returning empty list");
    return new Response(JSON.stringify([]), { status: 200 });
  }

  const payload = await verifySessionToken(access_token);
  console.log("📌 Token payload:", payload);

  if (!payload || !payload.id) {
    console.warn("⚠️ Invalid token or user not found, returning empty list");
    return new Response(JSON.stringify([]), { status: 200 });
  }

  const userId = payload.id;

  const { data, error } = await supabase
    .from("purchases")
    .select("*")
    .eq("user_id", userId);

  console.log("📌 Purchases fetched:", data, "Error:", error);

  if (error) {
    console.error("❌ Error fetching purchases:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }

  console.log("✅ Purchases returned successfully");
  return new Response(JSON.stringify(data), { status: 200 });
}
