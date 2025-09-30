import AuthCard, { BrandButton } from "@/components/AuthCard";
import Link from "next/link";
export default function SuccessAccount() {
  return (
    <AuthCard>
      <div className="flex flex-col items-center gap-6">
        <div className="w-14 h-14 rounded-full bg-brand-green/15 grid place-items-center">
          <div className="w-7 h-7 rounded-full bg-brand-green text-white grid place-items-center">✓</div>
        </div>
        <h2 className="text-2xl font-semibold">Account Created Successfully!</h2>
        <Link href="/auth/login"><BrandButton className="px-5">Go To Home</BrandButton></Link>
      </div>
    </AuthCard>
  );
}
