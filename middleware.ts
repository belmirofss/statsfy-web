import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Sends logged in visitors from the landing page to their overview. Doing it
// here instead of in the page lets the landing page be static.
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const expiresAt = typeof token?.expires_at === "number" ? token.expires_at : 0;

  if (Date.now() < expiresAt * 1000) {
    return NextResponse.redirect(new URL("/resume", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
