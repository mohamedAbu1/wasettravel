import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { requireAdmin } from "@/lib/auth/admin";

export async function POST(req) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "File must be 5MB or smaller" }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadDir = path.join(process.cwd(), "public/iamges"); // مجلد iamges

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const extension = path.extname(file.name).toLowerCase();
  const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
  if (!allowedExtensions.has(extension)) {
    return NextResponse.json({ error: "Unsupported image type" }, { status: 415 });
  }

  const fileName = `${Date.now()}-${crypto.randomUUID()}${extension}`;
  const filePath = path.join(uploadDir, fileName);
  fs.writeFileSync(filePath, buffer);

  // رابط دائم على موقعك
  const publicUrl = `https://basttettravel.com/iamges/${fileName}`;

  return NextResponse.json({ url: publicUrl });
}
