import api from "./axios";

export interface DashboardData {
  salesToday: {
    revenue: number;
    tickets: number;
  };

  salesMonth: {
    revenue: number;
    tickets: number;
  };

  clients: {
    total: number;
  };

  employees: {
    total: number;
  };

  popularServices: {
    _id: string;
    sales: number;
    revenue: number;
  }[];

  topEmployees: {
    _id: string;
    revenue: number;
    tickets: number;
  }[];
}

export const getAdminDashboard = async (): Promise<DashboardData> => {
  const response = await api.get("/dashboard");

  return response.data.dashboard;
};
