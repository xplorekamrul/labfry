"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthCard, { BrandButton, TextInput } from "@/components/AuthCard";
import { api } from "@/lib-client/api";
import { getErrMsg } from "@/lib/get-err-msg";

const VALID_ROLES = ["CUSTOMER", "PROVIDER"] as const;
type ChosenRole = (typeof VALID_ROLES)[number];

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const roleParam = (params.get("role") || "").toUpperCase();

  const role = useMemo<ChosenRole | null>(
    () => (VALID_ROLES.find((r) => r === roleParam) ?? null),
    [roleParam]
  );

  useEffect(() => {
    if (!role) router.replace("/role-select");
  }, [role, router]);

  const [form, set] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
    agree: false,
  });
  const [loading, setLoading] = useState<boolean>(false);

  async function submit() {
    if (!role) return;
    if (form.password !== form.confirm) return alert("Passwords do not match");
    setLoading(true);
    try {
      await api("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          role,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          agree: form.agree,
        }),
      });
      router.push(`/auth/verify?email=${encodeURIComponent(form.email)}`);
    } catch (e: unknown) {
      alert(getErrMsg(e));
    } finally {
      setLoading(false);
    }
  }

  if (!role) return null;

  return (
    <AuthCard title="Create your Account" subtitle="When sports Meets smart Tech.">
      <div className="mb-4 flex items-center justify-center gap-3 text-sm">
        <span className="rounded-full border border-zinc-200 px-3 py-1">
          Selected role: <b>{role === "CUSTOMER" ? "Customer" : "Service Provider"}</b>
        </span>
        <a href="/role-select" className="text-brand-red underline">
          Change
        </a>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <TextInput placeholder="First Name" value={form.firstName} onChange={(e) => set({ ...form, firstName: e.target.value })}/>
          <TextInput placeholder="Last name"  value={form.lastName}  onChange={(e) => set({ ...form, lastName: e.target.value })}/>
        </div>
        <TextInput placeholder="Email address" type="email" value={form.email} onChange={(e) => set({ ...form, email: e.target.value })}/>
        <TextInput placeholder="Password" type="password" value={form.password} onChange={(e) => set({ ...form, password: e.target.value })}/>
        <TextInput placeholder="Confirm Password" type="password" value={form.confirm} onChange={(e) => set({ ...form, confirm: e.target.value })}/>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.agree} onChange={(e) => set({ ...form, agree: e.target.checked })}/>
          I agree to Tech Takes Terms of Service and Privacy Policy.
        </label>

        <BrandButton onClick={submit} disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </BrandButton>

        <div className="text-center text-sm text-zinc-500">
          OR
          <div className="mt-6">
            Already have an account?{" "}
            <a href="/auth/login" className="text-brand-red font-medium">Login</a>
          </div>
        </div>
      </div>
    </AuthCard>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}