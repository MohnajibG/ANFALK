export type Role = "admin" | "cashier" | "employee";

export interface JwtPayload {
  id: string;
  role: Role;
}
import { Request } from "express";
import { UserRole } from "../models/User";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}
