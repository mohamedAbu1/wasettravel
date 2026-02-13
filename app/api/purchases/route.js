import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/utils/JWToken";

export async function GET() {
  console.log("📌 [API] Purchases route called");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const cookieStore = await cookies();
  const access_token = cookieStore.get("sb_access")?.value;

  if (!access_token) {
    return new Response(JSON.stringify([]), { status: 200 }); // ✅ مصفوفة مباشرة
  }

  const payload = await verifySessionToken(access_token);

  if (!payload || !payload.id) {
    return new Response(JSON.stringify([]), { status: 200 }); // ✅ مصفوفة مباشرة
  }

  const userId = payload.id;

 const { data, error } = await supabase
  .from("purchases")
  .select(`
    id,
    created_at,
    users ( name, email ),
    trips ( title )
  `)

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }

  return new Response(JSON.stringify(data), { status: 200 }); // ✅ مصفوفة مباشرة
}
