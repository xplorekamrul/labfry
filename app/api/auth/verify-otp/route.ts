export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongo";
import { User } from "@/models/User";
import { OtpCode } from "@/models/OtpCode";

export async function POST(req: Request) {
  await dbConnect(process.env.MONGODB_URI!);
  const { email, code } = await req.json();
  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const otp = await OtpCode.findOne({ userId: user._id, purpose: "VERIFY" }).sort({ createdAt: -1 });
  if (!otp || otp.code !== code || otp.expiresAt < new Date())
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });

  user.emailVerified = true;
  await user.save();
  await OtpCode.deleteMany({ userId: user._id, purpose: "VERIFY" });

  return NextResponse.json({ ok: true });
}
