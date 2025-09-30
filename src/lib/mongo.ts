import mongoose from "mongoose";
declare global { // eslint-disable-next-line no-var
  var _mongoose: Promise<typeof mongoose> | undefined;
}
export async function dbConnect(uri: string) {
  if (!global._mongoose) {
    global._mongoose = mongoose.connect(uri).then((m) => {
      // TTL indexes for OTP & ResetToken
      m.connection.collection("otp_codes").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }).catch(()=>{});
      m.connection.collection("reset_tokens").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }).catch(()=>{});
      return m;
    });
  }
  return global._mongoose;
}
