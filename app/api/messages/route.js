import { supabase } from "@/lib/supabaseClient";

// ✅ إضافة رسالة جديدة
export async function POST(req) {
  const body = await req.json();
  const { user_id, content, sender_type } = body;

  const { data, error } = await supabase
    .from("messages")
    .insert([{ user_id, content, sender_type }])
    .select();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  return new Response(JSON.stringify(data[0]), { status: 201 });
}

// ✅ جلب الرسائل
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  let query = supabase
    .from("messages")
    .select("id, content, sender_type, created_at, users(name)");

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query.order("created_at", { ascending: true });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
