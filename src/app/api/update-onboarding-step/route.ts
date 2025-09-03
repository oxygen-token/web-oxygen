import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
  try {
    console.log("📡 POST /api/update-onboarding-step recibido");
    
    // Obtener el body de la petición
    const body = await request.json();
    console.log("📋 Body recibido:", body);
    
    // Enviar la petición al backend
    const backendResponse = await fetch('https://backend-render-main.onrender.com/update-onboarding-step', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward cookies from the original request
        'Cookie': request.headers.get('cookie') || '',
      },
      credentials: 'include',
      body: JSON.stringify(body),
    });
    
    if (backendResponse.ok) {
      const backendData = await backendResponse.json();
      console.log("✅ Backend response:", backendData);
      
      // Forward the response from backend
      return NextResponse.json(backendData, { status: 200 });
    } else {
      console.error("❌ Backend error:", backendResponse.status);
      return NextResponse.json(
        { success: false, message: "Backend error" },
        { status: backendResponse.status }
      );
    }
  } catch (error) {
    console.error("❌ Error en /api/update-onboarding-step:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
