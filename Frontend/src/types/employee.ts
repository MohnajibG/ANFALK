export type EmployeeRole = "employee" | "cashier";

export type EmployeeSpeciality =
  | "Hair"
  | "Nails"
  | "Makeup"
  | "Massage"
  | "Reception";

export interface Employee {
  _id: string;

  firstName: string;
  lastName: string;

  phone?: string;

  speciality?: EmployeeSpeciality;
  role: EmployeeRole;
  isActive: boolean;
}
