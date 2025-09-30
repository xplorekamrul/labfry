export const runtime = "nodejs";
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("accessToken", "", { path: "/", maxAge: 0 });
  return res;
}
