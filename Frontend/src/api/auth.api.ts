import api from "./axios";
import type { AuthUser } from "../context/AuthContext";

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: AuthUser;
};

class AuthApi {
  async login(data: LoginPayload): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/login", data);

    return response.data;
  }

  async me(): Promise<AuthUser> {
    const response = await api.get<AuthUser>("/auth/me");

    return response.data;
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    await api.patch("/auth/change-password", {
      currentPassword,
      newPassword,
    });
  }

  async logout(): Promise<void> {
    // si plus tard tu fais un logout serveur
    // await api.post("/auth/logout");
  }
}

export const authApi = new AuthApi();
