"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AuthCard, { BrandButton, TextInput } from "@/components/AuthCard";
import { api } from "@/lib-client/api";
import { getErrMsg } from "@/lib/get-err-msg";

// Avoid prerender/export errors for a URL-param dependent page
export const dynamic = "force-dynamic";

export default function ResetPage() {
  return (
    <Suspense
      fallback={
        <AuthCard title="Loading…" subtitle="Preparing your reset form.">
          {/* AuthCard requires children; simple skeleton/placeholder is fine */}
          <div className="space-y-3">
            <div className="h-10 rounded bg-zinc-200/70" />
            <div className="h-10 rounded bg-zinc-200/70" />
            <div className="h-10 rounded bg-zinc-200/70" />
          </div>
        </AuthCard>
      }
    >
      <ResetInner />
    </Suspense>
  );
}

function ResetInner() {
  const params = useSearchParams();
  const router = useRouter();

  // read once, memoize
  const token = useMemo(() => params.get("token") || "", [params]);

  const [form, set] = useState<{ pass: string; confirm: string }>({
    pass: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!token) return alert("Invalid or missing token in the link.");
    if (form.pass !== form.confirm) return alert("Passwords do not match");
    setLoading(true);
    try {
      await api("/api/password/reset", {
        method: "POST",
        body: JSON.stringify({ token, password: form.pass }),
      });
      router.push("/auth/success-password");
    } catch (e: unknown) {
      alert(getErrMsg(e));
    } finally {
      setLoading(false);
    }
  }

  const disabled = loading || !token || !form.pass || !form.confirm;

  return (
    <AuthCard
      title="Enter your new password"
      subtitle="Type your new password twice to confirm. (The token comes from your reset link.)"
    >
      <div className="space-y-4">
        {!token && (
          <p className="text-sm text-red-600">
            Missing token in URL. Please open the password reset link from your email.
          </p>
        )}

        <TextInput
          placeholder="New password"
          type="password"
          value={form.pass}
          onChange={(e) => set({ ...form, pass: e.target.value })}
        />
        <TextInput
          placeholder="Confirm password"
          type="password"
          value={form.confirm}
          onChange={(e) => set({ ...form, confirm: e.target.value })}
        />

        <BrandButton onClick={submit} disabled={disabled}>
          {loading ? "Resetting..." : "Reset Password"}
        </BrandButton>
      </div>
    </AuthCard>
  );
}
