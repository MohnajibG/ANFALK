// src/context/AuthContext.tsx

import { createContext, useEffect, useState, type ReactNode } from "react";

import { authService } from "../services/auth.service";

import type { AuthUser, LoginPayload } from "../types/auth";

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

  const loadUser = async () => {
    try {
      const token = authService.getToken();

      if (!token) {
        setUser(null);
        return;
      }

      const response = await authService.me();

      setUser(response.user);
    } catch (error) {
      console.error("Erreur récupération utilisateur", error);

      await authService.logout();

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (mounted) {
        await loadUser();
      }
    };

    void init();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (data: LoginPayload) => {
    const response = await authService.login(data);

    setUser(response.user);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  };

  const refreshUser = async () => {
    await loadUser();
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
