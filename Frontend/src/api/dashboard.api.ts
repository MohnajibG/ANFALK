import api from "./axios";

export const getAdminDashboard = async () => {
  const response = await api.get("/dashboard");

  return response.data;
};
