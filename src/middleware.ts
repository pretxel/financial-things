import { NextResponse, NextRequest } from "next/server";

function getSecretKey(): string {
  return process.env.SECRET_KEY_API as string;
}
export async function middleware(request: NextRequest): Promise<NextResponse> {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "No valid token provided" },
        { status: 401 }
      );
    }

    // Get the token from the header
    const token = authHeader.split(" ")[1];

    // Check token validity against secret key
    if (token !== getSecretKey()) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    return NextResponse.next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export const config = {
  matcher: "/api/transactions/:path*",
};
