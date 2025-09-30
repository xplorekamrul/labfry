import AuthCard, { BrandButton } from "@/components/AuthCard";
import Link from "next/link";
export default function SuccessPassword() {
  return (
    <AuthCard>
      <div className="flex flex-col items-center gap-6">
        <div className="w-14 h-14 rounded-full bg-brand-green/15 grid place-items-center">
          <div className="w-7 h-7 rounded-full bg-brand-green text-white grid place-items-center">✓</div>
        </div>
        <h2 className="text-2xl font-semibold">Password Changed Successfully!</h2>
        <p className="text-zinc-500 -mt-2">Your account is set up! Just verify your email to get started.</p>
        <Link href="/auth/login"><BrandButton>Go To Login</BrandButton></Link>
      </div>
    </AuthCard>
  );
}
