import api from "./axios";

import type {
  CashRegister,
  OpenCashRegisterPayload,
  CloseCashRegisterPayload,
} from "../types/cashRegister";

const API_URL = "/cash-register";

export const openCashRegister = async (
  payload: OpenCashRegisterPayload,
): Promise<CashRegister> => {
  const { data } = await api.post(`${API_URL}/open`, payload);
  return data.register;
};

export const closeCashRegister = async (
  payload: CloseCashRegisterPayload,
): Promise<CashRegister> => {
  const { data } = await api.patch(`${API_URL}/close`, payload);
  return data.register;
};

export const getCurrentCashRegister =
  async (): Promise<CashRegister | null> => {
    const { data } = await api.get(`${API_URL}/current`);
    return data.register;
  };

export const getCashRegisterHistory = async (
  params?: Record<string, string>,
): Promise<CashRegister[]> => {
  const { data } = await api.get(`${API_URL}/history`, { params });
  return data.history ?? [];
};
