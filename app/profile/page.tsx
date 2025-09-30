// app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib-client/api";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setWsToken } from "@/store/authSlice";
import { RootState } from "@/store";
import { setOnline } from "@/store/presenceSlice";
import { getSocket } from "@/lib-client/socket";

export default function ProfilePage() {
  const user = useSelector((s: RootState) => s.auth.user);
  const wsToken = useSelector((s: RootState) => s.auth.wsToken);
  const online = useSelector((s: RootState) => s.presence.online);
  const dispatch = useDispatch();

  // local UI goodies
  const [onlineCount, setOnlineCount] = useState<number | null>(null);
  const [lastAck, setLastAck] = useState<string | null>(null);

  // 1) hydrate user from API
  useEffect(() => {
    api("/api/me")
      .then((u) => {
        dispatch(
          setUser({
            id: u.id,
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            role: u.role,
            emailVerified: u.emailVerified,
          })
        );
        dispatch(setOnline(!!u.isOnline));
      })
      .catch(() => {});
  }, [dispatch]);

  // 2) ensure we have a wsToken (lost on hard refresh)
  useEffect(() => {
    if (wsToken) return;
    api("/api/auth/ws-token")
      .then(({ wsToken }) => {
        if (wsToken) dispatch(setWsToken(wsToken));
      })
      .catch((e) => {
        console.warn("Unable to mint wsToken:", e?.message || e);
      });
  }, [wsToken, dispatch]);

  // 3) connect socket once we have the token
  useEffect(() => {
    if (!wsToken) return;
    const s = getSocket(wsToken);

    const onSelf = (p: { online: boolean }) => dispatch(setOnline(p.online));
    const onCount = (n: number) => setOnlineCount(n);
    const onAck = () => setLastAck(new Date().toLocaleTimeString());

    s.on("presence:self", onSelf);
    s.on("stats:onlineCount", onCount);
    s.on("activity:shout:ack", onAck);

    // request a presence update so admins see us online + ensures counter emits
    s.emit("presence:update", { online: true });

    return () => {
      s.off("presence:self", onSelf);
      s.off("stats:onlineCount", onCount);
      s.off("activity:shout:ack", onAck);
    };
  }, [wsToken, dispatch]);

  // 4) actions
  function togglePresence() {
    if (!wsToken) {
      console.warn("Socket not ready (no wsToken yet).");
      return;
    }
    const s = getSocket(wsToken);
    s.emit("presence:update", { online: !online });
  }

  function shout() {
    if (!wsToken) return;
    const s = getSocket(wsToken);
    const messages = [
      "Hello Admins! ",
      "Live ping from my profile",
      "Everyything Npw on reaal Time  ",
      "Socket Now Live with demo ",
    ];
    s.emit("activity:shout", { text: messages[Math.floor(Math.random() * messages.length)] });
  }

  return (
    <div className="min-h-[90vh] flex items-start justify-center pt-24">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-semibold text-center mb-10">Personal Information</h1>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-10 text-zinc-700">
          <div>
            <div className="text-sm">Fast Name</div>
            <div className="border-b mt-2 pb-3">{user?.firstName || "-"}</div>
          </div>
          <div>
            <div className="text-sm">Last Name</div>
            <div className="border-b mt-2 pb-3">{user?.lastName || "-"}</div>
          </div>
          <div>
            <div className="text-sm">Email</div>
            <div className="border-b mt-2 pb-3">{user?.email || "-"}</div>
          </div>
          <div>
            <div className="text-sm">Role</div>
            <div className="border-b mt-2 pb-3">{user?.role || "-"}</div>
          </div>
        </div>

        {/* Realtime actions */}
        <div className="mt-12 flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-500">Click the Button To test Socket Activity</span>
            <button
              onClick={togglePresence}
              className={`px-4 h-10 rounded-full border ${
                online ? "bg-green-100 border-green-300" : "bg-zinc-100 border-zinc-300"
              }`}
            >
              {online ? "ON = user online" : "OFF = user offline"}
            </button>
            <span className="text-sm text-zinc-500">
              Toggles socket event and shows a toast in your app
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={shout}
              className="px-4 h-10 rounded-md bg-[var(--brand-red)] text-white hover:opacity-95"
              title="Sends a realtime shout to the admin monitor"
            >
              Shout to Admins
            </button>
            {lastAck && (
              <span className="text-sm text-zinc-500">
                sent • <span className="font-medium">{lastAck}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="relative inline-flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-sm text-zinc-700">
              {onlineCount === null ? "Connecting…" : `${onlineCount} user(s) online now`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
