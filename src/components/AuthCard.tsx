import React from "react";

export default function AuthCard({ title, subtitle, children }: { title?: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center">
      <div className="w-full max-w-md px-6">
        {/* <div className="flex items-center gap-2 mb-8">
          <Image src="/brand/labfry.svg" alt="Labfry" width={92} height={28}/>
        </div> */}
        {title && (
          <div className="text-center mb-6">
            <h1 className="text-3xl font-semibold">{title}</h1>
            {subtitle && <p className="text-zinc-500 mt-2">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export function BrandButton({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`w-full h-12 bg-red-500 rounded-[12px] bg-brand-red text-white font-medium shadow-brand
      hover:opacity-95 active:opacity-90 transition ${className||""}`}
    >
      {children}
    </button>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full h-12 rounded-[10px] border border-zinc-200 px-4 bg-white
      placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-200 ${props.className||""}`}
    />
  );
}
