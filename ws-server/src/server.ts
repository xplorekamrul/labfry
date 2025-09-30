//ws-server/src/server.ts
import { createServer } from "http";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { env } from "./env";

type JWTPayload = { uid: string; role: string; email: string; verified: boolean };

const httpServer = createServer();
const io = new Server(httpServer, {
   cors: { origin: env.CORS_ORIGIN, credentials: true },
   transports: ["websocket", "polling"],
});

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

   socket.on("presence:update", (data: { online: boolean }) => {
      io.to("admins").emit("presence:changed", { userId: user.uid, online: !!data.online, at: Date.now() });
      io.to(`user:${user.uid}`).emit("presence:self", { online: !!data.online });
   });

   socket.on("disconnect", () => {
      io.to("admins").emit("presence:changed", { userId: user.uid, online: false, at: Date.now() });
   });
});

httpServer.listen(process.env.WS_PORT || env.WS_PORT, () => {
   console.log(`WS server on :${process.env.WS_PORT || env.WS_PORT}`);
});
