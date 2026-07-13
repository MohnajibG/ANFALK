import { authApi, type LoginPayload } from "../api/auth.api";
import type { AuthUser } from "../context/AuthContext";

const TOKEN_KEY = "token";

class AuthService {
  async login(data: LoginPayload): Promise<AuthUser> {
    const { token, user } = await authApi.login(data);

    localStorage.setItem(TOKEN_KEY, token);

    return user;
  }

  async me(): Promise<AuthUser> {
    return authApi.me();
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return authApi.changePassword(currentPassword, newPassword);
  }

  async logout() {
    localStorage.removeItem(TOKEN_KEY);

    await authApi.logout();
  }

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
