export type EmployeeRole = "employee" | "cashier";

export type Speciality = "Hair" | "Nails" | "Makeup" | "Massage" | "Reception";

export interface Employee {
  _id: string;

  firstName: string;

  lastName: string;

  email: string;

  phone?: string;

  role: EmployeeRole;

  speciality?: Speciality;

  isActive: boolean;

  mustChangePassword?: boolean;

  createdAt?: string;

  updatedAt?: string;
}

export interface EmployeeForm {
  firstName: string;

  lastName: string;

  email: string;

  phone: string;

  role: EmployeeRole;

  speciality: Speciality;
}

export interface CreateEmployeeResponse {
  success: boolean;

  employee: {
    id: string;

    firstName: string;

    lastName: string;

    email: string;

    role: EmployeeRole;

    speciality?: Speciality;

    mustChangePassword: boolean;
  };

  temporaryPassword: string;
}

export interface EmployeeApiResponse {
  message: string;
  success: boolean;

  employees: Employee[];
}

export interface EmployeeResponse {
  success: boolean;
  employee: Employee;
  message?: string;
}
