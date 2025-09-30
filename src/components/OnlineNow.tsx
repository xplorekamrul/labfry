"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib-client/api";
import { getSocket } from "@/lib-client/socket";

export default function OnlineNow() {
  const [count, setCount] = useState<number | null>(null);
  const [wsToken, setWsToken] = useState<string | null>(null);

  useEffect(() => {
    api("/api/auth/ws-token").then(({ wsToken }) => setWsToken(wsToken)).catch(()=>{});
  }, []);
  useEffect(() => {
    if (!wsToken) return;
    const s = getSocket(wsToken);
    const onCount = (n: number) => setCount(n);
    s.on("stats:onlineCount", onCount);
    s.on("connect", () => s.emit("presence:update", { online: true }));
    return () => {
      s.off("stats:onlineCount", onCount);
    };
  }, [wsToken]);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div className="rounded-full bg-white/90 backdrop-blur border shadow px-4 py-2 flex items-center gap-2">
        <span className="relative inline-flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
        </span>
        <span className="text-sm text-zinc-800">
          {count === null ? "Connecting…" : `${count} online`}
        </span>
      </div>
    </div>
  );
}
