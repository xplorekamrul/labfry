// models/User.ts
import { Schema, model, models, Model, Types } from "mongoose";

export type Role = "ADMIN" | "CUSTOMER" | "PROVIDER";

export interface IUser {
  firstName?: string;
  lastName?: string;
  email: string;
  passwordHash: string;
  role: Role;                
  emailVerified: boolean;
  isOnline: boolean;
  lastSeen: Date | null;
}
export type IUserDoc = IUser & { _id: Types.ObjectId };

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, trim: true },
    lastName:  { type: String, trim: true },
    email:     { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["ADMIN", "CUSTOMER", "PROVIDER"], default: "CUSTOMER", index: true },
    emailVerified: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: null },
  },
  { timestamps: true }
);

export const User: Model<IUser> = (models.User as Model<IUser>) || model<IUser>("User", UserSchema);
