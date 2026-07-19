import api from "./axios";

import type { Employee } from "../types/employee";

interface EmployeeFilters {
  search?: string;
  role?: "employee" | "cashier";
  isActive?: boolean;
  limit?: number;
}

export const getEmployees = async (
  params?: EmployeeFilters,
): Promise<Employee[]> => {
  try {
    const response = await api.get("/employees", {
      params,
    });

    return response.data.employees ?? response.data;
  } catch (error) {
    console.error("[Employee API] getEmployees:", error);

    throw error;
  }
};

export const updateEmployeeStatus = async (id: string) => {
  try {
    const response = await api.patch(`/employees/${id}/status`);

    return response.data;
  } catch (error) {
    console.error("[Employee API] updateEmployeeStatus:", error);

    throw error;
  }
};

export const deleteEmployee = async (id: string) => {
  try {
    const response = await api.delete(`/employees/${id}`);

    return response.data;
  } catch (error) {
    console.error("[Employee API] deleteEmployee:", error);

    throw error;
  }
};
