"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib-client/api";
import { getSocket } from "@/lib-client/socket";

type Role = "ADMIN" | "CUSTOMER" | "PROVIDER";

type PresenceEvt = {
  userId: string;
  email: string;
  online: boolean;
  at: number;
};

type ShoutEvt = {
  from: { id: string; email: string; role: string };
  text: string;
  at: number;
};

type FeedItem =
  | ({ t: "presence" } & PresenceEvt)
  | ({ t: "shout" } & ShoutEvt);

type ApiMe = { role: Role };
type WsTokenResp = { wsToken: string };

export default function AdminMonitor() {
  const [wsToken, setWsToken] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [onlineCount, setOnlineCount] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "connecting" | "ready" | "error">("connecting");

  // get role & ws token
  useEffect(() => {
    api("/api/me")
      .then((u: ApiMe) => setRole(u.role))
      .catch(() => setRole(null));

    api("/api/auth/ws-token")
      .then(({ wsToken }: WsTokenResp) => setWsToken(wsToken))
      .catch(() => setWsToken(null));
  }, []);

  // connect and subscribe
  useEffect(() => {
    if (!wsToken) return;
    const s = getSocket(wsToken);

    const onPresence = (p: PresenceEvt) =>
      setFeed((f) => {
        const item: FeedItem = { t: "presence", ...p }; // keep 't' literal
        return [item, ...f].slice(0, 50);
      });

    const onShout = (m: ShoutEvt) =>
      setFeed((f) => {
        const item: FeedItem = { t: "shout", ...m }; // keep 't' literal
        return [item, ...f].slice(0, 50);
      });

    const onCount = (n: number) => setOnlineCount(n);

    const onConnect = () => setStatus("ready");
    const onError = (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Unknown error";
      console.error("Socket connect_error:", msg);
      setStatus("error");
    };

    s.on("connect", onConnect);
    s.on("connect_error", onError);
    s.on("presence:changed", onPresence);
    s.on("activity:shout", onShout);
    s.on("stats:onlineCount", onCount);

    // nudge a presence update so counters broadcast
    s.emit("presence:update", { online: true });

    return () => {
      s.off("connect", onConnect);
      s.off("connect_error", onError);
      s.off("presence:changed", onPresence);
      s.off("activity:shout", onShout);
      s.off("stats:onlineCount", onCount);
    };
  }, [wsToken]);

  // Not admin? Explain why feed is empty.
  if (role !== "ADMIN") {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold mb-2">Live Monitor (Admins)</h1>
        <p className="text-sm text-zinc-600">
          You are signed in as <b>{role ?? "guest"}</b>. This page receives events only for
          <b> ADMIN</b> users (sockets join the <code>admins</code> room).
          <br />
          Log in with the email set in <code>ADMIN_EMAIL</code> to view the feed.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Live Monitor (Admins)</h1>
        <div className="text-sm text-zinc-600">
          {onlineCount === null ? "Connecting…" : `${onlineCount} online`}
        </div>
      </div>

      <div className="mt-2 text-xs text-zinc-500">Status: {status}</div>

      <ul className="space-y-3 mt-6">
        {feed.map((item, i) =>
          item.t === "presence" ? (
            <li key={i} className="rounded border px-4 py-3 text-sm">
              <b>{item.email}</b> is now{" "}
              <span className={item.online ? "text-green-600" : "text-zinc-600"}>
                {item.online ? "ONLINE" : "offline"}
              </span>{" "}
              <span className="text-zinc-500">
                ({new Date(item.at).toLocaleTimeString()})
              </span>
            </li>
          ) : (
            <li key={i} className="rounded border px-4 py-3 text-sm">
              <span className="rounded bg-zinc-100 px-2 py-0.5 mr-2">
                {item.from.role}
              </span>
              <b>{item.from.email}</b>: {item.text}{" "}
              <span className="text-zinc-500">
                ({new Date(item.at).toLocaleTimeString()})
              </span>
            </li>
          )
        )}
        {feed.length === 0 && (
          <li className="text-zinc-500">
            Waiting for events… Open <code>/profile</code> in another tab and toggle presence
            or press “Shout to Admins”.
          </li>
        )}
      </ul>
    </main>
  );
}
