import { NextRequest, NextResponse } from "next/server";

export class Auth {
  getSecretKey(): string {
    return process.env.SECRET_KEY_API as string;
  }

  async validateToken(request: NextRequest): Promise<NextResponse | null> {
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
      if (token !== this.getSecretKey()) {
        return NextResponse.json({ error: "Invalid token" }, { status: 403 });
      }

      return null;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ error: error }, { status: 500 });
    }
  }
}
