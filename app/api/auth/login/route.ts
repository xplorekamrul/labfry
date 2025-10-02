export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongo";
import { User } from "@/models/User";
import { verifyPassword } from "@/lib/passwords";
import { signAccess, signWsToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    await dbConnect(process.env.MONGODB_URI!);

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const emailRaw = (body?.email ?? "").toString().trim();
    const password = (body?.password ?? "").toString();
    const remember = Boolean(body?.remember);

    if (!emailRaw || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const email = emailRaw.toLowerCase();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    if (process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL.toLowerCase()) {
      if (user.role !== "ADMIN") {
        user.role = "ADMIN";
        await user.save();
      }
    }

    const payload = {
      uid: String(user._id),
      role: user.role as "ADMIN" | "CUSTOMER" | "PROVIDER",
      email: user.email,
      verified: !!user.emailVerified,
    };

    const accessToken = signAccess(payload, remember);
    const wsToken = signWsToken(payload);

    const res = NextResponse.json(
      {
        ok: true,
        user: {
          id: String(user._id),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
        },
        wsToken,
      },
      {
        headers: { "Cache-Control": "no-store" },
      }
    );

    res.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: remember ? 7 * 24 * 60 * 60 : 2 * 60 * 60,
    });

    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
