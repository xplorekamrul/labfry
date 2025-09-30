//ws-server/src/env.ts
import { z } from "zod";
export const Env = z.object({
  WS_PORT: z.coerce.number().default(5050),
  CORS_ORIGIN: z.string().url(),
  JWT_SECRET: z.string().min(32),
});
export const env = Env.parse(process.env);
