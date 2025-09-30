export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongo";
import { User } from "@/models/User";
import { OtpCode } from "@/models/OtpCode";
import { ResetToken } from "@/models/ResetToken";
import crypto from "crypto";

export async function POST(req: Request) {
  await dbConnect(process.env.MONGODB_URI!);
  const { email, code } = await req.json();

  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ error: "Invalid code" }, { status: 400 });

  const otp = await OtpCode.findOne({ userId: user._id, purpose: "RESET" }).sort({ createdAt: -1 });
  if (!otp || otp.code !== code || otp.expiresAt < new Date()) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
  }

  // OTP consumed — remove all RESET OTPs for this user
  await OtpCode.deleteMany({ userId: user._id, purpose: "RESET" });

  // Create one-time reset token (30 minutes)
  const token = crypto.randomBytes(24).toString("hex");
  await ResetToken.create({
    userId: user._id,
    token,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000),
  });

  return NextResponse.json({ ok: true, token });
}
