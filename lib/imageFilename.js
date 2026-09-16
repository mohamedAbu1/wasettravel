import path from "path";
import fs from "fs";

export function createUniqueImageFilename(originalName, uploadDir) {
  const extension = path.extname(originalName || "").toLowerCase() || ".webp";
  const originalBase = path.basename(originalName || "image", extension);
  const slug = originalBase
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase() || "image";

  let filename = `${slug}${extension}`;
  let counter = 1;
  while (fs.existsSync(path.join(uploadDir, filename))) {
    filename = `${slug}-${counter}${extension}`;
    counter += 1;
  }
  return filename;
}

