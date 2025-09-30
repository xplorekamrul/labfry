import jwt from "jsonwebtoken";
const SECRET = process.env.JWT_SECRET!;
export type JwtPayload = { uid: string; role: string; email: string; verified: boolean };
export function signAccess(payload: JwtPayload, remember=false) {
  return jwt.sign(payload, SECRET, { expiresIn: remember ? "7d":"2h" });
}
export function signWsToken(payload: JwtPayload) {
  return jwt.sign(payload, SECRET, { expiresIn: "30m" }); // client will hold this only for socket
}
export function verifyAccess(t: string){ return jwt.verify(t, SECRET) as JwtPayload; }
