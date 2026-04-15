import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

export async function createJWT(payload: {
  userId: string;
  username: string;
  role: string;
}) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyJWT(token: string) {
  try {
    const verified = await jwtVerify(token, secret);
    return verified.payload;
  } catch (err) {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("auth", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("auth");
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get("auth")?.value;
}

export async function getAuthUser() {
  const token = await getAuthToken();
  if (!token) return null;
  return verifyJWT(token);
}

export async function authenticateAdmin(req: NextRequest) {
  const token = req.cookies.get("auth")?.value;
  if (!token) return null;

  const user = await verifyJWT(token);
  if (!user || user.role !== "ADMIN") return null;

  return user;
}
