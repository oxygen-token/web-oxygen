"use client";
import { createContext, useContext, ReactNode } from "react";

interface DevContextType {
  isDevMode: boolean;
  mockUser: {
    username: string;
    email: string;
    isFirstLogin: boolean;
  } | null;
}

const DevContext = createContext<DevContextType | undefined>(undefined);

export const useDev = () => {
  const context = useContext(DevContext);
  if (context === undefined) {
    throw new Error("useDev must be used within a DevProvider");
  }
  return context;
};

interface DevProviderProps {
  children: ReactNode;
}

export const DevProvider = ({ children }: DevProviderProps) => {
  const isDevMode = false; // Volver a false ahora que el backend funciona
  
  const mockUser = null; // No usar mockUser

  const value = {
    isDevMode,
    mockUser,
  };

  return <DevContext.Provider value={value}>{children}</DevContext.Provider>;
}; 