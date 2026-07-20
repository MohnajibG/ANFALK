import type {
  Employee,
  EmployeeApiResponse,
  CreateEmployeeResponse,
  EmployeeForm,
} from "../types/employee";

const API_URL = "https://site--ankelk--dnxhn8mdblq5.code.run";

const getToken = () => localStorage.getItem("token");

const requestHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

interface EmployeeQuery {
  search?: string;
  role?: "employee" | "cashier";
  isActive?: boolean;
  limit?: number;
}

export const getEmployees = async (
  params: EmployeeQuery | string = "",
): Promise<Employee[]> => {
  const query = new URLSearchParams();

  if (typeof params === "string") {
    if (params) query.append("search", params);
  } else {
    if (params.search) query.append("search", params.search);

    if (params.role) query.append("role", params.role);

    if (params.isActive !== undefined) {
      query.append("isActive", String(params.isActive));
    }

    if (params.limit) {
      query.append("limit", String(params.limit));
    }
  }

  const response = await fetch(`${API_URL}/api/employees?${query.toString()}`, {
    method: "GET",
    headers: requestHeaders(),
  });

  const data: EmployeeApiResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Impossible de récupérer les employés");
  }

  return data.employees ?? [];
};

/*
================================
CREATION
================================
*/

export const createEmployee = async (
  form: EmployeeForm,
): Promise<CreateEmployeeResponse> => {
  const response = await fetch(`${API_URL}/api/employees`, {
    method: "POST",
    headers: requestHeaders(),
    body: JSON.stringify(form),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erreur création employé");
  }

  return data;
};

/*
================================
UPDATE
================================
*/

export const updateEmployee = async (
  id: string,
  data: Partial<EmployeeForm>,
): Promise<Employee> => {
  const response = await fetch(`${API_URL}/api/employees/${id}`, {
    method: "PATCH",
    headers: requestHeaders(),
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Erreur modification employé");
  }

  return result.employee;
};

/*
================================
STATUS
================================
*/

export const updateEmployeeStatus = async (
  id: string,
  isActive: boolean,
): Promise<Employee> => {
  const response = await fetch(`${API_URL}/api/employees/${id}/status`, {
    method: "PATCH",
    headers: requestHeaders(),
    body: JSON.stringify({ isActive }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Erreur changement statut");
  }

  return result.employee;
};

/*
================================
DELETE
================================
*/

export const deleteEmployee = async (id: string): Promise<Employee> => {
  const response = await fetch(`${API_URL}/api/employees/${id}`, {
    method: "DELETE",
    headers: requestHeaders(),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Erreur suppression employé");
  }

  return result.employee;
};

/*
================================
GET BY ID
================================
*/

export const getEmployeeById = async (id: string): Promise<Employee> => {
  const response = await fetch(`${API_URL}/api/employees/${id}`, {
    method: "GET",
    headers: requestHeaders(),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Impossible de récupérer l'employé");
  }

  return result.employee;
};
