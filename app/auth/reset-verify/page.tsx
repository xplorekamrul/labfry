"use client";
import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AuthCard, { BrandButton } from "@/components/AuthCard";
import { api } from "@/lib-client/api";
import Otp from "@/components/otp";
import { getErrMsg } from "@/lib/get-err-msg";

type VerifyResp = { token: string };

function ResetVerifyForm() {
  const params = useSearchParams();
  const email = params.get("email") || "";
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  async function submit() {
    setLoading(true);
    try {
      const res = await api("/api/password/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, code }),
      }) as VerifyResp;
      router.push(`/auth/reset?token=${encodeURIComponent(res.token)}`);
    } catch (e: unknown) {
      alert(getErrMsg(e));
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

export default function ResetVerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetVerifyForm />
    </Suspense>
  );
}