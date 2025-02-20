import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const cookies = req.headers.get("cookie") || "";
  const cookieMap = Object.fromEntries(
    cookies.split("; ").map((c) => c.split("="))
  );

  if (!cookieMap.jwt) {
    return NextResponse.json({ loggedIn: false }, { status: 401 });
  }

  return NextResponse.json({
    loggedIn: true,
    username: cookieMap.username || "",
  });
}
