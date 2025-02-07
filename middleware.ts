import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export function middleware(req: any) {
  const isAuthenticated = !!auth(); // Check if the user is logged in

  console.log("isAuthenticated", req.nextUrl.pathname);

  const protectedRoutes = ["/campaigns", "/dashboard"]; // Add more routes if needed

  if (protectedRoutes.includes(req.nextUrl.pathname) && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.url)); // Redirect to login
  }

  return NextResponse.next();
}

// Apply middleware only to protected routes
export const config = {
  matcher: ["/campaigns"],
};