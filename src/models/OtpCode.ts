import { Schema, model, models, Types } from "mongoose";
const OtpSchema = new Schema({
  userId: { type: Types.ObjectId, ref: "User", index:true, required:true },
  code: { type:String, required:true }, 
  purpose: { type:String, enum:["VERIFY"], required:true },
  expiresAt: { type:Date, required:true, index:true },
},{ timestamps:{ createdAt:true, updatedAt:false } });
export const OtpCode = models.OtpCode || model("OtpCode", OtpSchema, "otp_codes");

