"use server";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  role?: "student" | "admin";
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const loginUrl = new URL("/", request.url); 
  const token = request.cookies.get("accessToken")?.value;

  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin/dashboard")
  ) {
    if (!token) {
      return NextResponse.redirect(loginUrl);
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.NEXT_PUBLIC_JWT_SECRET!
      ) as DecodedToken;

      // ✅ Check expiration
      if (decoded?.exp && Date.now() >= decoded.exp * 1000) {
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete("accessToken");
        return response;
      }

      // ✅ Role-based routing
      if (pathname.startsWith("/dashboard") && decoded.role !== "student") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }

      if (pathname.startsWith("/admin") && decoded.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      return NextResponse.next();
    } catch (error) {
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("accessToken");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
