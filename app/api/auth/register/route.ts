// app/api/auth/register/route.ts
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongo";
import { User } from "@/models/User";
import { OtpCode } from "@/models/OtpCode";
import { hashPassword } from "@/lib/passwords";
import { sendOTP } from "@/lib/email";

const TEN_MIN = 10 * 60 * 1000;
const code6 = () => String(Math.floor(100000 + Math.random() * 900000));
const ALLOWED_REG_ROLES = new Set(["CUSTOMER", "PROVIDER"]); // users can pick only these two on role-select

export async function POST(req: Request) {
  await dbConnect(process.env.MONGODB_URI!);
  const { role, firstName, lastName, email, password, agree } = await req.json();

  if (!agree) return NextResponse.json({ error: "Terms not accepted" }, { status: 400 });
  if (!email || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const exists = await User.findOne({ email });
  if (exists) return NextResponse.json({ error: "Email already in use" }, { status: 409 });

  // Determine final role
  let finalRole = ALLOWED_REG_ROLES.has(String(role).toUpperCase())
    ? String(role).toUpperCase()
    : "CUSTOMER";

  // If email matches ADMIN_EMAIL, force ADMIN
  if (process.env.ADMIN_EMAIL && email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()) {
    finalRole = "ADMIN";
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    role: finalRole, // <-- persist chosen/forced role
    passwordHash: await hashPassword(password),
  });

  const code = code6();
  await OtpCode.create({
    userId: user._id,
    code,
    purpose: "VERIFY",
    expiresAt: new Date(Date.now() + TEN_MIN),
  });
  await sendOTP(email, code);

  return NextResponse.json({ ok: true });
}
