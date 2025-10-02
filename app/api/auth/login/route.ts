export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongo";
import { User } from "@/models/User";
import { verifyPassword } from "@/lib/passwords";
import { signAccess, signWsToken } from "@/lib/jwt";

type JwtRole = "ADMIN" | "CUSTOMER" | "PROVIDER";

interface LoginBody {
  email: string;
  password: string;
  remember?: boolean;
}

function isLoginBody(v: unknown): v is LoginBody {
  if (typeof v !== "object" || v === null) return false;
  const obj = v as Record<string, unknown>;
  return (
    typeof obj.email === "string" &&
    typeof obj.password === "string" &&
    (obj.remember === undefined || typeof obj.remember === "boolean")
  );
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await dbConnect(process.env.MONGODB_URI!);

    let parsed: unknown;
    try {
      parsed = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (!isLoginBody(parsed)) {
      return NextResponse.json({ error: "email and password are required" }, { status: 400 });
    }

    const email = parsed.email.trim().toLowerCase();
    const password = parsed.password;
    const remember = Boolean(parsed.remember);

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
      role: user.role as JwtRole,
      email: user.email as string,
      verified: Boolean(user.emailVerified),
    };

    const accessToken: string = signAccess(payload, remember);
    const wsToken: string = signWsToken(payload);

    const res = NextResponse.json(
      {
        ok: true,
        user: {
          id: String(user._id),
          firstName: user.firstName as string | undefined,
          lastName: user.lastName as string | undefined,
          email: user.email as string,
          role: user.role as JwtRole,
          emailVerified: Boolean(user.emailVerified),
        },
        wsToken,
      },
      { headers: { "Cache-Control": "no-store" } }
    );

    res.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: remember ? 7 * 24 * 60 * 60 : 2 * 60 * 60, // 7d or 2h
    });

    return res;
  } catch (err: unknown) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
