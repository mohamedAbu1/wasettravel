// api/cover/route.js
import fs from "fs";
import path from "path";
import { requireAdmin } from "@/lib/auth/admin";

export async function POST(req) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  try {
    const formData = await req.formData();
    const coverFile = formData.get("cover_image");
    const folder = "iamges";
    const uploadDir = path.join(process.cwd(), "public", folder);

    let coverImageUrl = null;

    if (coverFile) {
      if (coverFile.size > 5 * 1024 * 1024) {
        return new Response(JSON.stringify({ success: false, error: "File must be 5MB or smaller" }), { status: 413 });
      }
      const extension = path.extname(coverFile.name).toLowerCase();
      if (![".jpg", ".jpeg", ".png", ".webp", ".avif"].includes(extension)) {
        return new Response(JSON.stringify({ success: false, error: "Unsupported image type" }), { status: 415 });
      }
      const originalName = `${Date.now()}-${crypto.randomUUID()}${extension}`;
      const uploadPath = path.join(uploadDir, originalName);

      if (!fs.existsSync(uploadPath)) {
        fs.writeFileSync(uploadPath, Buffer.from(await coverFile.arrayBuffer()));
      }

      coverImageUrl = `https://wasettravel.com/${folder}/${originalName}`;
    }

    return new Response(JSON.stringify({ success: true, cover_image: coverImageUrl }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
