// api/gallery/route.js
import fs from "fs";
import path from "path";
import { requireAdmin } from "@/lib/auth/admin";
import { toPublicImageUrl } from "@/lib/publicImageUrl";
import { createUniqueImageFilename } from "@/lib/imageFilename";

export async function POST(req) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  try {
    const formData = await req.formData();
    const galleryFiles = formData.getAll("gallery_images");
    const folder = "iamges";
    const uploadDir = path.join(process.cwd(), "public", folder);

    let galleryImageObjects = [];

    if (galleryFiles?.length > 0) {
      fs.mkdirSync(uploadDir, { recursive: true });
      for (const [index, file] of galleryFiles.entries()) {
        if (!file || typeof file.arrayBuffer !== "function") continue;
        if (file.size > 5 * 1024 * 1024) {
          return new Response(JSON.stringify({ success: false, error: "Each file must be 5MB or smaller" }), { status: 413 });
        }
        const extension = path.extname(file.name).toLowerCase();
        if (![".jpg", ".jpeg", ".png", ".webp", ".avif"].includes(extension)) {
          return new Response(JSON.stringify({ success: false, error: "Unsupported image type" }), { status: 415 });
        }
        const storedName = createUniqueImageFilename(file.name, uploadDir);
        const uploadPath = path.join(uploadDir, storedName);
        fs.writeFileSync(uploadPath, Buffer.from(await file.arrayBuffer()));

        const fileUrl = toPublicImageUrl(`/${folder}/${storedName}`);

        // ✅ استقبل أسماء اللغات من الـ formData
        const nameTranslations = {
          en: formData.get(`name_en_${index}`) || formData.get(`name_en_${file.name}`) || file.name,
          ar: formData.get(`name_ar_${index}`) || formData.get(`name_ar_${file.name}`) || "",
          fr: formData.get(`name_fr_${index}`) || formData.get(`name_fr_${file.name}`) || "",
          de: formData.get(`name_de_${index}`) || formData.get(`name_de_${file.name}`) || "",
          it: formData.get(`name_it_${index}`) || formData.get(`name_it_${file.name}`) || "",
          zh: formData.get(`name_zh_${index}`) || formData.get(`name_zh_${file.name}`) || "",
          es: formData.get(`name_es_${index}`) || formData.get(`name_es_${file.name}`) || "",
        };

        galleryImageObjects.push({
          url: fileUrl,
          name: nameTranslations,
        });
      }
    }

    return new Response(
      JSON.stringify({ success: true, gallery_images: galleryImageObjects }),
      { status: 201 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}
