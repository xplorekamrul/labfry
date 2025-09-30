import { createServer } from "http";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { env } from "./env";

type JWTPayload = { uid: string; role: "ADMIN"|"CUSTOMER"|"PROVIDER"; email: string; verified: boolean };

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: env.CORS_ORIGIN, credentials: true },
  transports: ["websocket", "polling"],
});

const socketsByUser = new Map<string, Set<string>>(); 
function onlineCount() { return socketsByUser.size; }
function bumpOnline(uid: string, sid: string) {
  const set = socketsByUser.get(uid) ?? new Set<string>();
  set.add(sid);
  socketsByUser.set(uid, set);
  io.emit("stats:onlineCount", onlineCount());
}
function dropOnline(uid: string, sid: string) {
  const set = socketsByUser.get(uid);
  if (!set) return;
  set.delete(sid);
  if (set.size === 0) socketsByUser.delete(uid);
  io.emit("stats:onlineCount", onlineCount());
}

io.use((socket, next) => {
  const token = socket.handshake.auth?.token as string | undefined;
  if (!token) return next(new Error("no token"));
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JWTPayload;
    (socket as any).user = payload;
    socket.join(`user:${payload.uid}`);
    if (payload.role === "ADMIN") socket.join("admins");
    next();
  } catch { next(new Error("bad token")); }
});

io.on("connection", (socket) => {
  const user = (socket as any).user as JWTPayload;

  bumpOnline(user.uid, socket.id);

  socket.on("presence:update", (data: { online: boolean }) => {
    io.to("admins").emit("presence:changed", { userId: user.uid, email: user.email, online: !!data.online, at: Date.now() });
    io.to(`user:${user.uid}`).emit("presence:self", { online: !!data.online });
  });

  socket.on("activity:shout", (payload: { text: string }) => {
    const text = String(payload?.text || "").slice(0, 140);
    if (!text) return;
    io.to("admins").emit("activity:shout", {
      from: { id: user.uid, email: user.email, role: user.role },
      text,
      at: Date.now()
    });
    io.to(`user:${user.uid}`).emit("activity:shout:ack", { ok: true, at: Date.now() });
  });

  socket.on("disconnect", () => {
    dropOnline(user.uid, socket.id);
    io.to("admins").emit("presence:changed", { userId: user.uid, email: user.email, online: false, at: Date.now() });
  });
});

httpServer.listen(process.env.WS_PORT || env.WS_PORT, () => {
  console.log(`WS server on :${process.env.WS_PORT || env.WS_PORT}`);
});
