"use client";
import { useState } from "react";
import AuthCard, { BrandButton, TextInput } from "@/components/AuthCard";
import { api } from "@/lib-client/api";
import { useRouter } from "next/navigation";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit() {
    setLoading(true);
    try {
      await api("/api/password/forgot", { method: "POST", body: JSON.stringify({ email }) });
      router.push(`/auth/reset-verify?email=${encodeURIComponent(email)}`);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard title="Forgot your password?" subtitle="Enter your email and we’ll send a 6-digit code to verify it’s you.">
      <div className="space-y-4">
        <TextInput placeholder="Email address" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <BrandButton onClick={submit} disabled={loading}>{loading ? "Sending..." : "Send code"}</BrandButton>
      </div>
    </AuthCard>
  );
}
