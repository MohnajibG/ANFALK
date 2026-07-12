import { Schema, model, Document, Types } from "mongoose";

export type UserRole = "admin" | "cashier" | "employee";

export type Speciality = "Hair" | "Nails" | "Makeup" | "Massage" | "Reception";

export interface IUser extends Document {
  firstName: string;
  lastName: string;

  email: string;
  password: string;
  phone: string;

  role: UserRole;
  speciality?: Speciality;

  isActive: boolean;
  mustChangePassword: boolean;

  createdBy?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // sécurité
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    role: {
      type: String,
      enum: ["admin", "cashier", "employee"],
      required: true,
      default: "employee",
    },

    speciality: {
      type: String,
      enum: ["Hair", "Nails", "Makeup", "Massage", "Reception"],
      default: undefined,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    mustChangePassword: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

export default model<IUser>("User", userSchema);
