import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { success: false, error: "CODE_REQUIRED" },
        { status: 400 }
      );
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://backend-render-7vh2.onrender.com";

    // Get auth cookie to forward to backend
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("auth_token");

    console.log("🎁 Proxying claim-oms request to backend:", backendUrl);

    const backendResponse = await fetch(`${backendUrl}/claim-oms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...(authCookie ? { "Cookie": `auth_token=${authCookie.value}` } : {}),
      },
      body: JSON.stringify({ code }),
    });

    const responseData = await backendResponse.json();

    if (!backendResponse.ok) {
      console.error("❌ Backend claim-oms failed:", backendResponse.status, responseData);
      return NextResponse.json(
        { success: false, error: responseData.error || "CLAIM_FAILED" },
        { status: backendResponse.status }
      );
    }

    console.log("✅ OMs claimed successfully:", responseData);

    return NextResponse.json(
      {
        success: true,
        amount: responseData.amount,
        newOmBalance: responseData.newOmBalance,
        message: responseData.message || "OMs claimed successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error in claim-oms route:", error);
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
