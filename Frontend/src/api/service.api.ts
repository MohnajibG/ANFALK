import axios from "axios";

import type {
  Service,
  CreateServicePayload,
  UpdateServicePayload,
} from "../types/service";

const API_URL = "https://site--ankelk--dnxhn8mdblq5.code.run/api";

const serviceApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

serviceApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export async function getServices(): Promise<Service[]> {
  const response = await serviceApi.get("/services");
  return response.data.services ?? response.data;
}

export async function getService(id: string): Promise<Service> {
  const response = await serviceApi.get(`/services/${id}`);
  return response.data.service ?? response.data;
}

export async function createService(
  data: CreateServicePayload,
): Promise<Service> {
  const response = await serviceApi.post("/services", data);

  return response.data.service ?? response.data;
}

export async function updateService(
  id: string,
  data: UpdateServicePayload,
): Promise<Service> {
  const response = await serviceApi.patch(`/services/${id}`, data);

  return response.data.service ?? response.data;
}

export async function deleteService(id: string): Promise<void> {
  await serviceApi.delete(`/services/${id}`);
}

export async function toggleServiceStatus(id: string): Promise<Service> {
  const response = await serviceApi.patch(`/services/${id}/status`);

  return response.data.service ?? response.data;
}
