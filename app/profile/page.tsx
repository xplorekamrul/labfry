"use client";
import { useEffect } from "react";
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

  // connect socket once we have the token
  useEffect(() => {
    if (!wsToken) return;
    const s = getSocket(wsToken);
    const onSelf = (p: { online: boolean }) => dispatch(setOnline(p.online));
    s.on("presence:self", onSelf);
    return () => {
      s.off("presence:self", onSelf);
    };
  }, [wsToken, dispatch]);

  function togglePresence() {
    if (!wsToken) {
      console.warn("Socket not ready (no wsToken yet).");
      return;
    }
    const s = getSocket(wsToken);
    s.emit("presence:update", { online: !online });
  }

  return (
    <div className="min-h-[90vh] flex items-start justify-center pt-24">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-semibold text-center mb-10">Personal Information</h1>
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

        <div className="mt-12 flex items-center gap-4">
          <span className="text-sm text-zinc-500">
            Click the Button To test Socket Activity 
          </span>
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
      </div>
    </div>
  );
}
