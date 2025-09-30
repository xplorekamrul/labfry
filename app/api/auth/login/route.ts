export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongo";
import { User } from "@/models/User";
import { verifyPassword } from "@/lib/passwords";
import { signAccess, signWsToken } from "@/lib/jwt";

export async function POST(req: Request) {
  await dbConnect(process.env.MONGODB_URI!);
  const { email, password, remember } = await req.json();

  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });

  if (process.env.ADMIN_EMAIL && email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()) {
    if (user.role !== "ADMIN") {
      user.role = "ADMIN";
      await user.save();
    }
  }

  const payload = {
    uid: String(user._id),
    role: user.role,
    email: user.email,
    verified: !!user.emailVerified,
  };
  const token  = signAccess(payload, !!remember);
  const wsToken = signWsToken(payload);

  const res = NextResponse.json({
    ok: true,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,             
      emailVerified: user.emailVerified,
    },
    wsToken,
  });
  res.cookies.set("accessToken", token, {
    httpOnly: true, sameSite: "lax", secure: true, path: "/",
    maxAge: remember ? 7*24*3600 : 2*3600,
  });
  return res;
}
