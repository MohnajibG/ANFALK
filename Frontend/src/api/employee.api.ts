import type {
  Employee,
  EmployeeApiResponse,
  CreateEmployeeResponse,
  EmployeeForm,
} from "../types/employee";

const API_URL = "https://site--ankelk--dnxhn8mdblq5.code.run";

const getToken = () => {
  return localStorage.getItem("token");
};

const requestHeaders = () => ({
  "Content-Type": "application/json",

  Authorization: `Bearer ${getToken()}`,
});

/**
 * Récupérer les employés
 */
export const getEmployees = async (search = ""): Promise<Employee[]> => {
  const response = await fetch(`${API_URL}/api/employees?search=${search}`, {
    method: "GET",

    headers: requestHeaders(),
  });

  const data: EmployeeApiResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Impossible de récupérer les employés");
  }

  return data.employees;
};

/**
 * Créer un employé
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

/**
 * Modifier un employé
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

/**
 * Activer / désactiver
 */
export const updateEmployeeStatus = async (
  id: string,
  isActive: boolean,
): Promise<Employee> => {
  const response = await fetch(`${API_URL}/api/employees/${id}/status`, {
    method: "PATCH",

    headers: requestHeaders(),

    body: JSON.stringify({
      isActive,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Erreur changement statut");
  }

  return result.employee;
};

/**
 * Suppression logique
 */
export const deleteEmployee = async (id: string) => {
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

/**
 * Récupérer un employé par son id
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
