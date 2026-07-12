export type Role = "admin" | "cashier" | "employee";

export interface JwtPayload {
  id: string;
  role: Role;
}
