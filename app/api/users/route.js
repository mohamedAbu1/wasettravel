import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  // جلب المستخدمين مع الرسائل والتعليقات
const { data, error } = await supabase
  .from("users")
  .select("id, name, email");


console.log(data)
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
