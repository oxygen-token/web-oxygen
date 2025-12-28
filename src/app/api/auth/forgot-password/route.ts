import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://backend-render-7vh2.onrender.com";

    console.log("📧 Proxying forgot-password request to backend:", backendUrl);

    const backendResponse = await fetch(`${backendUrl}/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const responseData = await backendResponse.json();

    if (!backendResponse.ok) {
      console.error("❌ Backend forgot-password failed:", backendResponse.status, responseData);
      return NextResponse.json(
        { success: false, error: responseData.error || "Request failed" },
        { status: backendResponse.status }
      );
    }

    console.log("✅ Forgot password email sent successfully");

    return NextResponse.json(
      {
        success: true,
        message: responseData.message || "Reset email sent",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error in forgot-password route:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
