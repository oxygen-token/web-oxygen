import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Token and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://backend-render-7vh2.onrender.com";

    console.log("🔑 Proxying reset-password request to backend:", backendUrl);

    const backendResponse = await fetch(`${backendUrl}/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ token, newPassword }),
    });

    const responseData = await backendResponse.json();

    if (!backendResponse.ok) {
      console.error("❌ Backend reset-password failed:", backendResponse.status, responseData);
      return NextResponse.json(
        { success: false, error: responseData.error || "Reset failed" },
        { status: backendResponse.status }
      );
    }

    console.log("✅ Password reset successfully");

    return NextResponse.json(
      {
        success: true,
        message: responseData.message || "Password updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error in reset-password route:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
