import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Obtener la URL del backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://backend-render-7vh2.onrender.com";

    console.log("🔍 Checking session with backend:", backendUrl);

    // Obtener todas las cookies del request
    const cookieHeader = req.headers.get("cookie") || "";

    // Hacer la petición al backend incluyendo las cookies
    const backendResponse = await fetch(`${backendUrl}/session`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Cookie": cookieHeader, // Forwarding cookies to backend
      },
      credentials: "include",
    });

    const responseData = await backendResponse.json();

    if (!backendResponse.ok) {
      console.log("❌ Session check failed:", backendResponse.status);
      return NextResponse.json(
        { loggedIn: false },
        { status: 401 }
      );
    }

    console.log("✅ Session valid:", responseData.loggedIn);

    // Devolver los datos de la sesión
    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("❌ Error checking session:", error);
    return NextResponse.json(
      { loggedIn: false },
      { status: 500 }
    );
  }
}
