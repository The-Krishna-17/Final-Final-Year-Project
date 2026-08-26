import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = new Set([
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/verify-email",
  "/public-blogs",
  "/public-jobs",
]);

const isPublicRoute = (pathname: string): boolean => {
  if (PUBLIC_ROUTES.has(pathname)) return true;
  if (pathname.startsWith("/reset-password")) return true;
  if (pathname.startsWith("/verify-email/")) return true;
  if (pathname.startsWith("/public-blogs")) return true;
  if (pathname.startsWith("/public-jobs")) return true;
  if (pathname.startsWith("/api/")) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname.startsWith("/favicon")) return true;
  return false;
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken");

  if (!accessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};
