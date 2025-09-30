"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import AuthCard, { BrandButton } from "@/components/AuthCard";
import { api } from "@/lib-client/api";
import Otp from "@/components/otp";

export default function ResetVerifyPage() {
  const params = useSearchParams();
  const email = params.get("email") || "";
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit() {
    setLoading(true);
    try {
      const res = await api("/api/password/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, code }),
      });
      // On success, we get a one-time reset token
      router.push(`/auth/reset?token=${encodeURIComponent(res.token)}`);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard title="Verify your email" subtitle={`We sent a 6-digit code to ${email || "your email"}. Enter it below to continue.`}>
      <div className="space-y-6">
        <Otp value={code} onChange={setCode} />
        <BrandButton onClick={submit} disabled={loading || code.length < 6}>
          {loading ? "Verifying..." : "Verify & Continue"}
        </BrandButton>
      </div>
    </AuthCard>
  );
}
