export const runtime = "nodejs";

import { NextResponse, NextRequest } from "next/server";

function clearAuthCookies(res: NextResponse) {
  res.cookies.set("accessToken", "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
  res.cookies.set("refreshToken", "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
}

export async function POST(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/auth/login", req.url), 303); 
  clearAuthCookies(res);
  return res;
}
export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/auth/login", req.url), 303);
  clearAuthCookies(res);
  return res;
}
