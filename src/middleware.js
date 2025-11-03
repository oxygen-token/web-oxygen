import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ["es", "en"],
  defaultLocale: "es",
});

export default async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  
  if (pathname.includes("/dashboard")) {
    const env = process.env.NEXT_PUBLIC_ENV;
    const bypassAuth = process.env.NEXT_PUBLIC_BYPASS_AUTH;
    const nodeEnv = process.env.NODE_ENV;
    
    const isProduction = nodeEnv === "production" || env === "production";
    const isDevMode = !isProduction 
      && env === "development" 
      && bypassAuth === "true";
    
    if (!isDevMode) {
      const cookies = request.headers.get("cookie") || "";
      const cookieMap = Object.fromEntries(
        cookies.split("; ").map((c) => c.split("="))
      );
      
      if (!cookieMap.jwt) {
        const locale = pathname.split("/")[1];
        const loginUrl = `/${locale}/login`;
        return NextResponse.redirect(new URL(loginUrl, request.url));
      }
    }
  }
  
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
