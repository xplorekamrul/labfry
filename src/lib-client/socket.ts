"use client";
import { io, Socket } from "socket.io-client";

let sock: Socket | null = null;

export function getSocket(wsToken: string) {
  const WS_URL = process.env.NEXT_PUBLIC_WS_URL!;
  if (!sock || !sock.connected) {
    sock = io(WS_URL, {
      transports: ["websocket", "polling"],
      auth: { token: wsToken },
      autoConnect: true,
    });

    sock.on("connect_error", (err) => {
      console.error("Socket connect_error:", err.message);
    });
    sock.on("disconnect", (reason) => {
      console.warn("Socket disconnected:", reason);
    });
  }
  return sock;
}

export function closeSocket() {
  if (sock) {
    sock.disconnect();
    sock = null;
  }
}
