"use client";
import { io, Socket } from "socket.io-client";

let sock: Socket | null = null;

export function getSocket(wsToken: string) {
  if (sock) return sock;
  const WS = process.env.NEXT_PUBLIC_WS_URL!;
  sock = io(WS, { transports: ["websocket", "polling"], auth: { token: wsToken } });
  return sock;
}
export function closeSocket() { if (sock) { sock.disconnect(); sock = null; } }
