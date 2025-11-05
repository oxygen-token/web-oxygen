import { NextResponse } from "next/server";
import { getBackendUrl } from "../../../../../utils/backendConfig";

export async function POST(req: Request) {
  console.log("📥 2FA Generate API Route called");
  try {
    const cookies = req.headers.get("cookie") || "";
    const cookieMap = Object.fromEntries(
      cookies.split("; ").map((c) => c.split("="))
    );

    const body = await req.json();
    const { email } = body;
    
    console.log("📦 Request body received:", {
      hasEmail: !!email,
    });

    if (!email) {
      console.error("❌ Missing email");
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const backendUrl = getBackendUrl("/auth/2fa/generate");
    console.log("🔗 Forwarding 2FA generate request to backend:", backendUrl);
    
    const generateResponse = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookieMap.jwt && { "Cookie": `jwt=${cookieMap.jwt}` }),
      },
      body: JSON.stringify({
        email,
      }),
    });

    console.log("📥 Backend response status:", generateResponse.status);

    if (!generateResponse.ok) {
      const errorData = await generateResponse.json().catch(() => ({}));
      console.error("❌ Backend error:", errorData);
      return NextResponse.json(
        { error: errorData.error || "Failed to generate 2FA code", success: false },
        { status: generateResponse.status }
      );
    }

    const generateData = await generateResponse.json();
    console.log("✅ 2FA code generated successfully");
    
    return NextResponse.json({
      success: true,
      message: generateData.message || "2FA code sent to your email",
    });
  } catch (error) {
    console.error("❌ Error generating 2FA:", error);
    if (error instanceof Error) {
      console.error("❌ Error details:", error.message, error.stack);
    }
    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

