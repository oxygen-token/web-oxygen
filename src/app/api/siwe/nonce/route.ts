import { NextResponse } from "next/server";
import { getBackendUrl } from "../../../../utils/backendConfig";

export async function POST(req: Request) {
  console.log("📥 SIWE Nonce API Route called");
  try {
    const cookies = req.headers.get("cookie") || "";
    console.log("🍪 Cookies received:", cookies.substring(0, 100));
    const cookieMap = Object.fromEntries(
      cookies.split("; ").map((c) => c.split("="))
    );

    if (!cookieMap.jwt) {
      console.error("❌ No JWT token found in cookies");
      return NextResponse.json(
        { error: "Unauthorized - No JWT token" },
        { status: 401 }
      );
    }

    const backendUrl = getBackendUrl("/wallet/nonce");
    console.log("🔗 Forwarding nonce request to backend:", backendUrl);
    console.log("📤 Making GET request to:", backendUrl);
    console.log("📤 Headers:", {
      "Cookie": `jwt=${cookieMap.jwt.substring(0, 20)}...`,
      "Content-Type": "application/json",
    });
    
    const nonceResponse = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Cookie": `jwt=${cookieMap.jwt}`,
        "Content-Type": "application/json",
      },
    });

    console.log("📥 Backend response status:", nonceResponse.status);
    console.log("📥 Backend response headers:", Object.fromEntries(nonceResponse.headers.entries()));

    if (!nonceResponse.ok) {
      const errorData = await nonceResponse.json().catch(() => ({}));
      console.error("❌ Backend error:", errorData);
      return NextResponse.json(
        { error: errorData.error || "Failed to generate nonce" },
        { status: nonceResponse.status }
      );
    }

    const nonceData = await nonceResponse.json();
    console.log("✅ Nonce received from backend:", nonceData.nonce);
    return NextResponse.json({ nonce: nonceData.nonce }, { status: 200 });
  } catch (error) {
    console.error("❌ Error generating nonce:", error);
    if (error instanceof Error) {
      console.error("❌ Error details:", error.message, error.stack);
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

