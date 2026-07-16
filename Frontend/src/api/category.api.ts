import axios from "axios";

import type { Category } from "../types/category";

const API_URL = "https://site--ankelk--dnxhn8mdblq5.code.run/api";

const categoryApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

categoryApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export async function getCategories(): Promise<Category[]> {
  const response = await categoryApi.get("/categories");

  return response.data;
}

export async function createCategory(data: {
  name: string;
  description?: string;
}): Promise<Category> {
  const response = await categoryApi.post("/categories", data);

  return response.data;
}

export async function updateCategory(
  id: string,
  data: {
    name?: string;
    description?: string;
  },
): Promise<Category> {
  const response = await categoryApi.patch(`/categories/${id}`, data);

  return response.data;
}

export async function deleteCategory(id: string) {
  await categoryApi.delete(`/categories/${id}`);
}
