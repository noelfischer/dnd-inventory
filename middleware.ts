import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getLocale } from "./lib/utils";

let locales = ['en', 'de', 'fr', 'it']

export async function middleware(req: any) {
  const isAuthenticated = !!(await auth()); // Check if the user is logged in

  //get pathname minus the locale
  const pathnames = req.nextUrl.pathname.split('/');
  let pathname = pathnames[pathnames.length - 1];
  const protectedRoutes = ["campaigns", "dashboard"]; // Add more routes if needed
  if (protectedRoutes.includes(pathname) && !isAuthenticated) {
    const locale = req.nextUrl.pathname.split('/')[1]; // Extract locale
    const loginPath = locales.includes(locale) ? `/${locale}/login` : "/login";
    return NextResponse.redirect(new URL(loginPath, req.url));
  }

  return localeMiddleware(req);
}

// https://nextjs.org/docs/app/building-your-application/routing/internationalization
export function localeMiddleware(request: any) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    // Store locale in a cookie for later use
    const locale = pathname.split("/")[1];
    const response = NextResponse.next();
    response.cookies.set("locale", locale, { path: "/" }); // Set locale cookie
    return response;
  }

  // Redirect if there is no locale
  const acceptLanguage = request.headers.get('Accept-Language')
  let cookieLocale = request.cookies.get("locale")?.value;
  cookieLocale = locales.includes(cookieLocale) ? cookieLocale : null;
  const locale = cookieLocale || getLocale(acceptLanguage, locales);
  request.nextUrl.pathname = `/${locale}${pathname}`
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(request.nextUrl)
}

// Apply middleware only to protected routes
export const config = {
  matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"],
};