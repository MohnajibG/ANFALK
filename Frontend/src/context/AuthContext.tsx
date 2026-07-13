import { createContext, useEffect, useState, type ReactNode } from "react";

import { authService } from "../services/auth.service";
import type { LoginPayload } from "../api/auth.api";

export type AuthUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "cashier" | "employee";
  speciality?: string;
  mustChangePassword: boolean;
  isActive: boolean;
};

export type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  login: (data: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | null>(null);

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const token = authService.getToken();

      if (!token) {
        setUser(null);
        return;
      }

      const currentUser = await authService.me();

      setUser(currentUser);
    } catch {
      await authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshUser();
  }, []);

  const login = async (data: LoginPayload) => {
    const loggedUser = await authService.login(data);

    setUser(loggedUser);
  };

  const logout = async () => {
    await authService.logout();

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
