import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  const body = await req.json();
  const {
    user_id,
    content,
    sender_type,
    user_name,
    user_image,
    reply_to,
    admin_id,
    image_base64,
  } = body;

  let imageUrl = null;

  if (image_base64) {
    const fileName = `${user_id}-${Date.now()}.png`;
    const fileBuffer = Buffer.from(image_base64, "base64");

    const { error: uploadError } = await supabase.storage
      .from("chat-images")
      .upload(fileName, fileBuffer, {
        contentType: "image/png",
        cacheControl: "31536000", // ✅ تخزين الصور سنة كاملة
      });

    if (uploadError) {
      return new Response(JSON.stringify({ error: uploadError.message }), {
        status: 400,
        headers: { "Cache-Control": "no-store" },
      });
    }

    const { data: publicUrlData } = supabase.storage
      .from("chat-images")
      .getPublicUrl(fileName);

    imageUrl = publicUrlData.publicUrl;
  }

  const { data, error } = await supabase
    .from("messages")
    .insert([
      {
        user_id,
        content: imageUrl || content,
        sender_type,
        user_name,
        user_image,
        reply_to,
        admin_id,
        status: "sent",
      },
    ])
    .select();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Cache-Control": "no-store" },
    });
  }

  return new Response(JSON.stringify(data[0]), {
    status: 201,
    headers: { "Cache-Control": "no-store" }, // ✅ لا تخزن الرد
  });
}

// ✅ جلب الرسائل
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  let query = supabase
    .from("messages")
    .select("id, content, sender_type, created_at, user_name, user_image, reply_to, admin_id, status");

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query.order("created_at", { ascending: true });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Cache-Control": "no-store" },
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Cache-Control": "no-cache" }, // ✅ اجلب أحدث نسخة دائمًا
  });
}

// ✅ تحديث حالة الرسالة
export async function PUT(req) {
  const body = await req.json();
  const { messageId } = body;

  const { data, error } = await supabase
    .from("messages")
    .update({ status: "seen" })
    .eq("id", messageId)
    .select();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Cache-Control": "no-store" },
    });
  }

  if (!data || data.length === 0) {
    return new Response(JSON.stringify({ error: "Message not found" }), {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }

  return new Response(JSON.stringify(data[0] ?? {}), {
    status: 200,
    headers: { "Cache-Control": "no-store" }, // ✅ لا تخزن الرد
  });
}
