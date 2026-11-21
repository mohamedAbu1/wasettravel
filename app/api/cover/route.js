// api/cover/route.js
import fs from "fs";
import path from "path";
import { requireAdmin } from "@/lib/auth/admin";
import { toPublicImageUrl } from "@/lib/publicImageUrl";
import { createUniqueImageFilename } from "@/lib/imageFilename";
import { isSupportedImage } from "@/lib/imageValidation";

export async function POST(req) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  try {
    const formData = await req.formData();
    const coverFile = formData.get("cover_image");
    const folder = "iamges";
    const uploadDir = path.join(process.cwd(), "public", folder);

    let coverImageUrl = null;

    if (coverFile && typeof coverFile.arrayBuffer === "function") {
      if (coverFile.size > 5 * 1024 * 1024) {
        return new Response(JSON.stringify({ success: false, error: "File must be 5MB or smaller" }), { status: 413 });
      }
      const extension = path.extname(coverFile.name).toLowerCase();
      if (![".jpg", ".jpeg", ".png", ".webp", ".avif"].includes(extension)) {
        return new Response(JSON.stringify({ success: false, error: "Unsupported image type" }), { status: 415 });
      }
      const buffer = Buffer.from(await coverFile.arrayBuffer());
      if (!isSupportedImage(buffer, extension)) {
        return new Response(JSON.stringify({ success: false, error: "The uploaded file is not a valid image" }), { status: 415 });
      }
      fs.mkdirSync(uploadDir, { recursive: true });
      const storedName = createUniqueImageFilename(coverFile.name, uploadDir);
      const uploadPath = path.join(uploadDir, storedName);
      fs.writeFileSync(uploadPath, buffer);

      coverImageUrl = toPublicImageUrl(`/${folder}/${storedName}`);
    }

    return new Response(JSON.stringify({ success: true, cover_image: coverImageUrl }), { status: 201 });
  } catch {
    return new Response(JSON.stringify({ success: false, error: "Unable to upload the cover image right now" }), { status: 500 });
  }
}
