import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Obtener la URL del backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://backend-render-7vh2.onrender.com";

    console.log("🔐 Proxying login request to backend:", backendUrl);

    // Hacer la petición al backend
    const backendResponse = await fetch(`${backendUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const responseData = await backendResponse.json();

    if (!backendResponse.ok) {
      console.error("❌ Backend login failed:", backendResponse.status, responseData);
      return NextResponse.json(
        { success: false, error: responseData.error || "Login failed" },
        { status: backendResponse.status }
      );
    }

    console.log("✅ Backend login successful");

    // Crear la respuesta de Next.js
    const response = NextResponse.json(
      {
        success: true,
        user: responseData.user,
        messageType: responseData.messageType,
      },
      { status: 200 }
    );

    // Copiar las cookies del backend a la respuesta de Next.js
    const setCookieHeaders = backendResponse.headers.getSetCookie();

    if (setCookieHeaders && setCookieHeaders.length > 0) {
      console.log(`🍪 Forwarding ${setCookieHeaders.length} cookies from backend`);

      setCookieHeaders.forEach((cookieString) => {
        // Parse the cookie string to extract name, value, and options
        const parts = cookieString.split(';').map(part => part.trim());
        const [nameValue] = parts;
        const [name, value] = nameValue.split('=');

        if (!name || !value) return;

        // Extract cookie options
        const cookieOptions: any = {
          path: '/',
        };

        parts.slice(1).forEach(part => {
          const [key, val] = part.split('=').map(s => s.trim());
          const lowerKey = key.toLowerCase();

          if (lowerKey === 'httponly') {
            cookieOptions.httpOnly = true;
          } else if (lowerKey === 'secure') {
            cookieOptions.secure = true;
          } else if (lowerKey === 'path') {
            cookieOptions.path = val;
          } else if (lowerKey === 'domain') {
            // En producción, usar el dominio del frontend
            // En desarrollo, no usar dominio (dejar que sea localhost)
            const host = req.headers.get('host') || '';
            const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');

            if (!isLocalhost) {
              cookieOptions.domain = val;
            }
          } else if (lowerKey === 'max-age') {
            cookieOptions.maxAge = parseInt(val);
          } else if (lowerKey === 'expires') {
            cookieOptions.expires = new Date(val);
          } else if (lowerKey === 'samesite') {
            cookieOptions.sameSite = val.toLowerCase();
          }
        });

        // En producción, asegurar que las cookies sean seguras
        const host = req.headers.get('host') || '';
        const isProduction = !host.includes('localhost') && !host.includes('127.0.0.1');

        if (isProduction) {
          cookieOptions.secure = true;
          cookieOptions.sameSite = cookieOptions.sameSite || 'lax';
        }

        console.log(`🍪 Setting cookie: ${name} with options:`, cookieOptions);

        // Set the cookie
        response.cookies.set(name, value, cookieOptions);
      });
    }

    return response;
  } catch (error) {
    console.error("❌ Error in login route:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
