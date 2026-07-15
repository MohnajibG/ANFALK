import api from "./axios";

export const getEmployees = async (params?: { search?: string }) => {
  const response = await api.get("/employees", {
    params,
  });

  return response.data;
};

export const updateEmployeeStatus = async (id: string) => {
  const response = await api.patch(`/employees/${id}/status`);

  return response.data;
};

export const deleteEmployee = async (id: string) => {
  const response = await api.delete(`/employees/${id}`);

  return response.data;
};
