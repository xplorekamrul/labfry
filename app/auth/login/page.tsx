"use client";
import { useState } from "react";
import AuthCard, { BrandButton, TextInput } from "@/components/AuthCard";
import Link from "next/link";
import { api } from "@/lib-client/api";
import { useDispatch } from "react-redux";
import { setUser, setWsToken } from "@/store/authSlice";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, set] = useState({ email:"", password:"", remember:true });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  async function submit() {
    setLoading(true);
    try {
      const data = await api("/api/auth/login", { method:"POST", body: JSON.stringify(form) });
      dispatch(setUser(data.user));
      dispatch(setWsToken(data.wsToken));
      router.push("/profile");
    } catch (e:any) { alert(e.message); } finally { setLoading(false); }
  }

  return (
    <AuthCard title="Welcome to Labfry" subtitle="Please share your login details so you can access the website.">
      <div className="space-y-4">
        <TextInput placeholder="Email address" type="email" value={form.email} onChange={e=>set({...form, email:e.target.value})}/>
        <TextInput placeholder="Password" type="password" value={form.password} onChange={e=>set({...form, password:e.target.value})}/>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.remember} onChange={e=>set({...form, remember:e.target.checked})}/> Remember me
          </label>
          <Link href="/auth/forgot" className="text-brand-red text-sm">Forgot password?</Link>
        </div>
        <BrandButton onClick={submit} disabled={loading}>{loading ? "Logging in..." : "Login"}</BrandButton>
        <div className="relative my-6 text-sm text-zinc-500">
          <div className="flex items-center gap-3">
            <div className="h-px bg-zinc-200 flex-1"></div>
            OR
            <div className="h-px bg-zinc-200 flex-1"></div>
          </div>
          <div className="text-center mt-6">
            Don’t have an account? <Link href="/auth/register" className="text-brand-red font-medium">Get started</Link>
          </div>
        </div>
      </div>
    </AuthCard>
  );
}
