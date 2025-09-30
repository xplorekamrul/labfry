"use client";
import React, { useRef } from "react";
export default function Otp({ value, onChange }: { value: string; onChange: (v: string)=>void }) {
  const refs = Array.from({length:6}, ()=>useRef<HTMLInputElement>(null));
  const handle = (i:number, e:React.ChangeEvent<HTMLInputElement>)=>{
    const v = e.target.value.replace(/\D/g,"").slice(-1);
    const arr = value.padEnd(6," ").split("");
    arr[i] = v;
    const joined = arr.join("").trimEnd();
    onChange(joined);
    if (v && i<5) refs[i+1].current?.focus();
    if (!v && i>0) refs[i-1].current?.focus();
  };
  return (
    <div className="flex gap-3 justify-center">
      {Array.from({length:6}).map((_,i)=>(
        <input key={i} ref={refs[i]} value={value[i]||""}
          onChange={(e)=>handle(i,e)} inputMode="numeric" maxLength={1}
          className="w-12 h-12 text-center text-xl border border-zinc-200 rounded-[10px] focus:ring-2 focus:ring-red-200"/>
      ))}
    </div>
  );
}
