export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongo";
import { ResetToken } from "@/models/ResetToken";
import { User } from "@/models/User";
import { hashPassword } from "@/lib/passwords";

export async function POST(req: Request) {
  await dbConnect(process.env.MONGODB_URI!);
  const { token, password } = await req.json();
  const doc = await ResetToken.findOne({ token });
  if (!doc || doc.expiresAt < new Date()) return NextResponse.json({ error: "Invalid or expired link" }, { status: 400 });
  const user = await User.findById(doc.userId);
  if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  user.passwordHash = await hashPassword(password);
  await user.save();
  await ResetToken.deleteMany({ userId: user._id });
  return NextResponse.json({ ok: true });
}
