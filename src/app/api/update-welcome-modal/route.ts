import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log("📡 POST /api/update-welcome-modal recibido");
    
    // Enviar la petición al backend
    const backendResponse = await fetch('http://localhost:10001/update-welcome-modal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward cookies from the original request
        'Cookie': request.headers.get('cookie') || '',
      },
      credentials: 'include',
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
    console.error("❌ Error en /api/update-welcome-modal:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
