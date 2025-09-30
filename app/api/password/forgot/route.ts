export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongo";
import { User } from "@/models/User";
import { OtpCode } from "@/models/OtpCode";
import { sendOTP } from "@/lib/email";

const TEN_MIN = 10 * 60 * 1000;
const code6 = () => String(Math.floor(100000 + Math.random() * 900000));

export async function POST(req: Request) {
  await dbConnect(process.env.MONGODB_URI!);
  const { email } = await req.json();
  const user = await User.findOne({ email });

  if (!user) return NextResponse.json({ ok: true });

  const code = code6();
  await OtpCode.create({
    userId: user._id,
    code,
    purpose: "RESET",
    expiresAt: new Date(Date.now() + TEN_MIN),
  });

  await sendOTP(email, code); 

  return NextResponse.json({ ok: true });
}
