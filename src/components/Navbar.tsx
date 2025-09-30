import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { unstable_noStore } from "next/cache";

export const dynamic = "force-dynamic";

type JwtPayload = {
  uid: string;
  role: "ADMIN" | "CUSTOMER" | "PROVIDER";
  email: string;
  verified: boolean;
};

export default async function NavBar() {
  unstable_noStore(); 

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  let hasToken = false;
  let role: JwtPayload["role"] | null = null;

  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      hasToken = true;
      role = payload.role;
    } catch {
      // invalid/expired token -> treat as logged out
      hasToken = false;
      role = null;
    }
  }

  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/brand/labfry.svg" alt="Labfry" width={96} height={24} />
          <span className="sr-only">Labfry</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm">
          <Link href="/" className="text-zinc-700 hover:text-zinc-900">
            Home
          </Link>

          {hasToken ? (
            <>
              {/* Role badge */}
              {role && (
                <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs uppercase text-zinc-700">
                  {role}
                </span>
              )}

              <Link href="/profile" className="text-zinc-700 hover:text-zinc-900">
                Profile
              </Link>

              {/* Optional: Admin-only nav item */}
              {role === "ADMIN" && (
                <Link href="/admin" className="text-zinc-700 hover:text-zinc-900">
                  Admin
                </Link>
              )}

              {/* POST logout */}
              <form action="/api/auth/logout" method="post">
                <button
                  type="submit"
                  className="rounded-md bg-zinc-100 px-3 py-1.5 text-zinc-800 hover:bg-zinc-200"
                  title="Logout"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-zinc-700 hover:text-zinc-900">
                Login
              </Link>
              <Link
                href="/role-select"
                className="rounded-md bg-[var(--brand-red)] px-3 py-1.5 text-white hover:opacity-95"
              >
                Create account
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
