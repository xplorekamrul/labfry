"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import AuthCard, { BrandButton } from "@/components/AuthCard";
import { api } from "@/lib-client/api";
import Otp from "@/components/otp";

export default function VerifyPage() {
  const params = useSearchParams();
  const email = params.get("email") || "";
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit() {
    setLoading(true);
    try {
      await api("/api/auth/verify-otp", { method:"POST", body: JSON.stringify({ email, code }) });
      router.push("/auth/success-account");
    } catch (e:any) { alert(e.message); } finally { setLoading(false); }
  }

  return (
    <AuthCard title="Please check your email!" subtitle={`We’ve emailed a 6-digit confirmation code to ${email || "your email"}.`}>
      <div className="space-y-6">
        <Otp value={code} onChange={setCode}/>
        <BrandButton onClick={submit} disabled={loading || code.length<6}>{loading ? "Verifying..." : "Verify"}</BrandButton>
        <div className="text-center text-sm">
          Don’t have a code? <button className="text-brand-red underline" onClick={()=>alert("Resend coming soon")}>Resend code</button>
        </div>
      </div>
    </AuthCard>
  );
}
