import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = new Set([
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/public-blogs",
  "/public-jobs",
]);

const isPublicRoute = (pathname: string): boolean => {
  if (PUBLIC_ROUTES.has(pathname)) return true;
  if (pathname.startsWith("/reset-password")) return true;
  if (pathname.startsWith("/public-blogs")) return true;
  if (pathname.startsWith("/public-jobs")) return true;
  if (pathname.startsWith("/api/")) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname.startsWith("/favicon")) return true;
  // SEO & static files — always public
  if (pathname === "/sitemap.xml") return true;
  if (pathname === "/robots.txt") return true;
  if (pathname.match(/\.(xml|txt|ico|png|jpg|jpeg|svg|webp|json)$/)) return true;
  return false;
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Authentication cookies belong to the API origin and are not visible to
  // this Vercel middleware. Protected client components validate the session
  // through the backend with credentials.

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};
