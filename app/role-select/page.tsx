"use client";
import AuthCard, { BrandButton } from "@/components/AuthCard";
import { useRouter } from "next/navigation";

export default function RoleSelect() {
  const router = useRouter();

  const choose = (role: "CUSTOMER" | "PROVIDER") => {
    router.push(`/auth/register?role=${role}`);
  };

  return (
    <AuthCard
      title="Select a Role"
      subtitle="Choose the option that best describes you so we can tailor your experience."
    >
      <div className="space-y-4">
        <BrandButton
          onClick={() => choose("CUSTOMER")}
          className="bg-red-300 text-brand-red shadow-none"
        >
          I’m a Customer →
        </BrandButton>
        <BrandButton
          onClick={() => choose("PROVIDER")}
          className="bg-zinc-100 text-zinc-900 shadow-none"
        >
          I’m a Service Provider →
        </BrandButton>
      </div>
    </AuthCard>
  );
}
