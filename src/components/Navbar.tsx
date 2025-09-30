// components/NavBar.tsx
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";

export default async function NavBar() {
  // Next 15: cookies() can be async in some contexts
  const cookieStore = await cookies();
  const hasToken = !!cookieStore.get("accessToken");

  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          {/* Replace with your actual logo file */}
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
              <Link href="/profile" className="text-zinc-700 hover:text-zinc-900">
                Profile
              </Link>
              {/* Simple POST form to your logout API */}
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
