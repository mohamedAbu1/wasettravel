export const dynamic = "force-static";

export function GET() {
  return new Response("google-site-verification: google49366a773d42ea4a.html", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
