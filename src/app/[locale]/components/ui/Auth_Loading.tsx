"use client";
import { useAuth } from "../../context/Auth_Context";
import { useDev } from "../../context/Dev_Context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

interface AuthLoadingProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const AuthLoading = ({ children, requireAuth = false, redirectTo = "/login" }: AuthLoadingProps) => {
  const { user, loading } = useAuth();
  const { isDevMode } = useDev();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  useEffect(() => {
    if (!loading && requireAuth && !user && !isDevMode) {
      router.push(`/${locale}${redirectTo}`);
    }
  }, [loading, user, requireAuth, redirectTo, router, locale, isDevMode]);

  if (loading && !isDevMode) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-dark via-teal-medium to-teal">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !user && !isDevMode) {
    return null;
  }

  return <>{children}</>;
};

export default AuthLoading; 