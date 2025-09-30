export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongo";
import { User, IUserDoc } from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  await dbConnect(process.env.MONGODB_URI!);

  // ⬇️ FIX: await cookies()
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { uid } = jwt.verify(accessToken, process.env.JWT_SECRET!) as { uid: string };
    const u = await User.findById(uid).lean<IUserDoc | null>();
    if (!u) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      id: u._id.toString(),
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      role: u.role,
      emailVerified: u.emailVerified,
      isOnline: u.isOnline,
      lastSeen: u.lastSeen,
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
