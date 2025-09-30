"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import AuthCard, { BrandButton, TextInput } from "@/components/AuthCard";
import { api } from "@/lib-client/api";

export default function ResetPage() {
  const token = useSearchParams().get("token") || "";
  const [form, set] = useState({ pass:"", confirm:"" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit() {
    if (form.pass !== form.confirm) return alert("Passwords do not match");
    setLoading(true);
    try {
      await api("/api/password/reset", { method:"POST", body: JSON.stringify({ token, password: form.pass }) });
      router.push("/auth/success-password");
    } catch(e:any){ alert(e.message); } finally { setLoading(false); }
  }

  return (
    <AuthCard title="Enter your new password" subtitle="Please enter the email address associated with your account, and we’ll email you a link to reset your password.">
      <div className="space-y-4">
        <TextInput placeholder="New password" type="password" value={form.pass} onChange={e=>set({...form, pass:e.target.value})}/>
        <TextInput placeholder="Confirm password" type="password" value={form.confirm} onChange={e=>set({...form, confirm:e.target.value})}/>
        <BrandButton onClick={submit} disabled={loading}>{loading ? "Resetting..." : "Reset Password"}</BrandButton>
      </div>
    </AuthCard>
  );
}
