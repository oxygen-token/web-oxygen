"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { get, post } from "../../../utils/request";
import { useDev } from "./Dev_Context";

interface User {
  username: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { isDevMode, mockUser } = useDev();

  const checkAuth = async () => {
    if (isDevMode && mockUser) {
      setUser(mockUser);
      setLoading(false);
      return;
    }

    try {
      const res = await get("/session");
      const data = await res.json();
      if (data.loggedIn) {
        setUser({ username: data.username });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    if (isDevMode && mockUser) {
      setUser(mockUser);
      return;
    }

    try {
      await post("/login", {
        Email: email,
        Pass: password,
      });
      await checkAuth();
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    if (isDevMode) {
      setUser(null);
      return;
    }

    try {
      await post("/logout");
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [isDevMode]);

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 