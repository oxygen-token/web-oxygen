import { NextResponse } from "next/server";
import { getBackendUrl } from "../../../../utils/backendConfig";

export async function POST(req: Request) {
  console.log("📥 SIWE Verify API Route called");
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

    const body = await req.json();
    const { message, signature } = body;
    console.log("📦 Request body received:", {
      hasMessage: !!message,
      hasSignature: !!signature,
      messageLength: message?.length || 0,
      signatureLength: signature?.length || 0,
    });

    if (!message || !signature) {
      console.error("❌ Missing message or signature");
      return NextResponse.json(
        { error: "Message and signature are required" },
        { status: 400 }
      );
    }

    const backendUrl = getBackendUrl("/wallet/link");
    console.log("🔗 Forwarding wallet link request to backend:", backendUrl);
    console.log("📤 Making POST request to:", backendUrl);
    console.log("📤 Headers:", {
      "Cookie": `jwt=${cookieMap.jwt.substring(0, 20)}...`,
      "Content-Type": "application/json",
    });
    
    const linkResponse = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Cookie": `jwt=${cookieMap.jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        signature,
      }),
    });

    console.log("📥 Backend response status:", linkResponse.status);
    console.log("📥 Backend response headers:", Object.fromEntries(linkResponse.headers.entries()));

    if (!linkResponse.ok) {
      const errorData = await linkResponse.json().catch(() => ({}));
      console.error("❌ Backend error:", errorData);
      return NextResponse.json(
        {
          error: errorData.error || "Failed to link wallet",
          details: errorData,
        },
        { status: linkResponse.status }
      );
    }

    const linkData = await linkResponse.json();
    console.log("✅ Wallet linked successfully:", linkData);
    return NextResponse.json({
      success: true,
      walletAddress: linkData.walletAddress || linkData.wallet_address,
      message: "Wallet linked successfully",
      ...linkData,
    });
  } catch (error) {
    console.error("❌ Error verifying SIWE:", error);
    if (error instanceof Error) {
      console.error("❌ Error details:", error.message, error.stack);
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

