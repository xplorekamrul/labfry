import { Schema, model, models, Types } from "mongoose";
const ResetTokenSchema = new Schema({
  userId: { type: Types.ObjectId, ref:"User", index:true, required:true },
  token:  { type:String, required:true, unique:true, index:true },
  expiresAt: { type:Date, required:true, index:true },
},{ timestamps:{ createdAt:true, updatedAt:false }});
export const ResetToken = models.ResetToken || model("ResetToken", ResetTokenSchema, "reset_tokens");
