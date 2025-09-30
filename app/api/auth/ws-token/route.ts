export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongo";
import { User } from "@/models/User";
import jwt from "jsonwebtoken";
import { signWsToken } from "@/lib/jwt";

export async function GET(req: Request) {
  await dbConnect(process.env.MONGODB_URI!);

  const cookieHeader = req.headers.get("cookie") || "";
  const accessToken = cookieHeader
    .split("; ")
    .find((c) => c.startsWith("accessToken="))
    ?.split("=")[1];

  if (!accessToken)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload = jwt.verify(accessToken, process.env.JWT_SECRET!) as {
      uid: string;
      role: "ADMIN" | "CUSTOMER" | "PROVIDER";
      email: string;
      verified: boolean;
    };

    const u = await User.findById(payload.uid).lean();
    if (!u) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const wsToken = signWsToken({
      uid: String(u._id),
      role: u.role,
      email: u.email,
      verified: !!u.emailVerified,
    });

    return NextResponse.json({ wsToken });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
