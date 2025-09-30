import { Schema, model, models, Types } from "mongoose";
const OtpSchema = new Schema({
  userId: { type: Types.ObjectId, ref: "User", index:true, required:true },
  code: { type:String, required:true }, 
  purpose: { type:String, enum:["VERIFY"], required:true },
  expiresAt: { type:Date, required:true, index:true },
},{ timestamps:{ createdAt:true, updatedAt:false } });
export const OtpCode = models.OtpCode || model("OtpCode", OtpSchema, "otp_codes");



// import { Schema, model, models, Types } from "mongoose";

// export const OTP_PURPOSES = {
//   VERIFY: "VERIFY",          
//   RESET: "RESET",            
//   LOGIN: "LOGIN",             
//   REGISTER: "REGISTER",       
// } as const;

// const OtpSchema = new Schema(
//   {
//     userId: { type: Types.ObjectId, ref: "User", index: true, required: true },
//     code: { type: String, required: true }, 
//     purpose: {
//       type: String,
//       enum: Object.values(OTP_PURPOSES),    
//       required: true,
//       index: true,
//     },
//     expiresAt: { type: Date, required: true, index: true },
//   },
//   { timestamps: { createdAt: true, updatedAt: false } }
// );

// OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// export const OtpCode = models.OtpCode || model("OtpCode", OtpSchema, "otp_codes");
