import jwt from "jsonwebtoken";

function getToken(request) {
  const authorization = request.headers.get("authorization") || "";
  if (authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.slice(7).trim();
  }

  return (
    request.cookies.get("token")?.value ||
    request.cookies.get("access-token")?.value ||
    request.cookies.get("sb_access")?.value ||
    null
  );
}

export function getAuthenticatedUser(request) {
  const token = getToken(request);
  if (!token || !process.env.JWT_SECRET) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

export function requireAdmin(request) {
  const user = getAuthenticatedUser(request);

  if (!user) {
    return { response: Response.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  if (String(user.role || "").toLowerCase() !== "admin") {
    return { response: Response.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { user };
}
