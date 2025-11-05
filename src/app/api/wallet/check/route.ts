import { NextResponse } from "next/server";
import { getBackendUrl } from "../../../../utils/backendConfig";

export async function GET(req: Request) {
  try {
    const cookies = req.headers.get("cookie") || "";
    const cookieMap = Object.fromEntries(
      cookies.split("; ").map((c) => c.split("="))
    );

    if (!cookieMap.jwt) {
      return NextResponse.json(
        { error: "Unauthorized - No JWT token" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get("address");

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    const sessionResponse = await fetch(getBackendUrl("/session"), {
      method: "GET",
      headers: {
        "Cookie": `jwt=${cookieMap.jwt}`,
        "Content-Type": "application/json",
      },
    });

    if (!sessionResponse.ok) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid session" },
        { status: 401 }
      );
    }

    const sessionData = await sessionResponse.json();
    if (!sessionData.loggedIn) {
      return NextResponse.json(
        { error: "Unauthorized - User not logged in" },
        { status: 401 }
      );
    }

    try {
      const walletCheckResponse = await fetch(
        `${getBackendUrl("/wallet/check")}?address=${encodeURIComponent(walletAddress)}`,
        {
          method: "GET",
          headers: {
            "Cookie": `jwt=${cookieMap.jwt}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (walletCheckResponse.ok) {
        const walletData = await walletCheckResponse.json();
        return NextResponse.json({
          isLinked: walletData.isLinked || false,
          walletAddress: walletData.walletAddress || null,
        });
      }

      return NextResponse.json({
        isLinked: false,
        walletAddress: null,
      });
    } catch (error) {
      return NextResponse.json({
        isLinked: false,
        walletAddress: null,
      });
    }
  } catch (error) {
    console.error("Error checking wallet:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

