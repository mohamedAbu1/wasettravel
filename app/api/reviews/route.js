import { supabase } from "@/lib/supabaseClient";

// ✅ جلب كل الريفيوهات
export async function GET() {
  const { data, error } = await supabase
    .from("reviews")
    .select(`
      id,
      trip_id,
      user_id,
      rating,
      comment,
      created_at,
      avatar_url,
      time,
      name,
      trips (id, title),
      users (id, name)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 400 });
  }
  return new Response(JSON.stringify({ success: true, reviews: data }), { status: 200 });
}

// ✅ إضافة تعليق جديد
export async function POST(req) {
  try {
    const body = await req.json();
    console.log("📥 Incoming review body:", body);

    const { trip_id, user_id, rating, comment, name, avatar_url, time } = body;

    const { data, error } = await supabase
      .from("reviews")
      .insert([
        {
          trip_id,
          user_id,
          rating,
          comment,
          name,
          avatar_url,
          time,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error("❌ Supabase insert error:", error);
      return new Response(JSON.stringify({ success: false, error: error.message }), { status: 400 });
    }

    console.log("✅ Supabase insert success:", data);
    return new Response(JSON.stringify({ success: true, review: data[0] }), { status: 201 });
  } catch (err) {
    console.error("❌ API Error:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
