// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <section className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight">
          When sports Meets smart Tech.
        </h1>
        <p className="mt-4 text-zinc-600">
          Authentication flows that match your Figma screens: register, verify OTP,
          login, forgot/reset password, role select, and a realtime presence toggle.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/role-select"
            className="rounded-lg bg-[var(--brand-red)] px-5 py-3 font-medium text-white shadow-brand hover:opacity-95"
          >
            Get started
          </Link>
          <Link
            href="/auth/login"
            className="rounded-lg border border-zinc-200 px-5 py-3 font-medium text-zinc-800 hover:bg-zinc-50"
          >
            Login
          </Link>
        </div>
      </section>

      <section className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 p-6">
          <h3 className="text-lg font-medium">Email OTP Verify</h3>
          <p className="mt-2 text-sm text-zinc-600">
            6-digit code, 10-minute expiry, matches the verify screen design.
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 p-6">
          <h3 className="text-lg font-medium">Realtime Presence</h3>
          <p className="mt-2 text-sm text-zinc-600">
            External Socket.IO server, profile toggle emits events and shows toast.
          </p>
        </div>
      </section>
    </main>
  );
}
