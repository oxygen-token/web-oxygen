import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Llamar al backend para invalidar la sesión
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://backend-render-7vh2.onrender.com";

    try {
      await fetch(`${backendUrl}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cookie": req.headers.get("cookie") || "",
        },
        credentials: "include",
      });
    } catch (backendError) {
      console.error("Error calling backend logout:", backendError);
      // Continuar con la limpieza de cookies aunque falle el backend
    }

    // Crear respuesta con todas las cookies limpiadas
    const response = NextResponse.json(
      { success: true, message: "Logout successful" },
      { status: 200 }
    );

    // Lista de cookies a limpiar
    const cookiesToClear = [
      'jwt',
      'username',
      'session',
      'auth',
      'token',
      'connect.sid',
      'next-auth.session-token',
      'next-auth.csrf-token',
      'next-auth.callback-url',
      'oxygen_token',
      'oxygen_session',
      'oxygen_auth',
      'oxygen_user',
      'NEXT_LOCALE',
    ];

    // Obtener el dominio actual
    const host = req.headers.get('host') || '';
    const isProduction = !host.includes('localhost') && !host.includes('127.0.0.1');
    const domain = isProduction ? host.split(':')[0] : 'localhost';

    // Limpiar cada cookie con todas las variaciones necesarias
    cookiesToClear.forEach(cookieName => {
      // Configuración básica para desarrollo
      response.cookies.set(cookieName, '', {
        path: '/',
        expires: new Date(0),
        maxAge: 0,
      });

      // Para producción, agregar flags de seguridad
      if (isProduction) {
        response.cookies.set(cookieName, '', {
          path: '/',
          domain: domain,
          expires: new Date(0),
          maxAge: 0,
          secure: true,
          httpOnly: true,
          sameSite: 'none',
        });

        // También limpiar con el dominio con punto
        response.cookies.set(cookieName, '', {
          path: '/',
          domain: `.${domain}`,
          expires: new Date(0),
          maxAge: 0,
          secure: true,
          httpOnly: true,
          sameSite: 'none',
        });
      }

      // Paths adicionales
      ['/dashboard', '/api', '/es', '/en'].forEach(path => {
        response.cookies.set(cookieName, '', {
          path: path,
          expires: new Date(0),
          maxAge: 0,
        });
      });
    });

    console.log(`✅ Logout exitoso - Cookies limpiadas para dominio: ${domain} (${isProduction ? 'PRODUCCIÓN' : 'DESARROLLO'})`);

    return response;
  } catch (error) {
    console.error("Error in logout route:", error);

    // Aún en caso de error, intentar limpiar cookies
    const response = NextResponse.json(
      { success: false, error: "Logout failed" },
      { status: 500 }
    );

    // Limpiar cookies básicas al menos
    ['jwt', 'username', 'session', 'auth'].forEach(cookieName => {
      response.cookies.set(cookieName, '', {
        path: '/',
        expires: new Date(0),
        maxAge: 0,
      });
    });

    return response;
  }
}
