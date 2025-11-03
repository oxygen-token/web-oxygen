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
  const env = process.env.NEXT_PUBLIC_ENV;
  const bypassAuth = process.env.NEXT_PUBLIC_BYPASS_AUTH;
  const nodeEnv = process.env.NODE_ENV;
  
  const isProduction = nodeEnv === "production" || env === "production";
  
  let isDevMode = false;
  let mockUser = null;
  
  if (typeof window !== "undefined") {
    isDevMode = !isProduction 
      && env === "development" 
      && bypassAuth === "true";
    
    mockUser = isDevMode ? {
      username: "Example User",
      email: "example@oxygen.com",
      isFirstLogin: false,
    } : null;
  }

  const value = {
    isDevMode,
    mockUser,
  };

  return <DevContext.Provider value={value}>{children}</DevContext.Provider>;
}; 