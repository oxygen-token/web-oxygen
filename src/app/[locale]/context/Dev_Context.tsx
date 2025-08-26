"use client";
import { createContext, useContext, ReactNode } from "react";

interface DevContextType {
  isDevMode: boolean;
  mockUser: {
    username: string;
    email: string;
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
  const isDevMode = process.env.NEXT_PUBLIC_BYPASS_AUTH === "true";
  
  const mockUser = isDevMode ? {
    username: "dev_user",
    email: "dev@oxygen.com"
  } : null;

  const value = {
    isDevMode,
    mockUser,
  };

  return <DevContext.Provider value={value}>{children}</DevContext.Provider>;
}; 