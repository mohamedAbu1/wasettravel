const signatures = {
  jpeg: [0xff, 0xd8, 0xff],
  png: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  gif: [0x47, 0x49, 0x46, 0x38],
};

function startsWithBytes(buffer, bytes) {
  return bytes.every((byte, index) => buffer[index] === byte);
}

export function detectImageType(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 12) return null;
  if (startsWithBytes(buffer, signatures.jpeg)) return "jpeg";
  if (startsWithBytes(buffer, signatures.png)) return "png";
  if (startsWithBytes(buffer, signatures.gif)) return "gif";
  if (buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP") return "webp";
  if (buffer.subarray(4, 12).toString("ascii") === "ftypavif") return "avif";
  return null;
}

export function isSupportedImage(buffer, extension) {
  const type = detectImageType(buffer);
  const normalizedExtension = String(extension || "").toLowerCase();
  const expected = normalizedExtension === ".jpg" || normalizedExtension === ".jpeg" ? "jpeg" : normalizedExtension.slice(1);
  return Boolean(type && ["jpeg", "png", "webp", "avif"].includes(type) && type === expected);
}
