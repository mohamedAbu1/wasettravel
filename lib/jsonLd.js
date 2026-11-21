/**
 * Serialize JSON-LD safely for an inline script tag.
 * Escaping HTML-sensitive characters prevents a database value containing
 * </script> from breaking out of the script context.
 */
export function serializeJsonLd(value) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
