// src/proxy.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/", "/events", "/login", "/success"];
const protectedPaths = ["/dashboard"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const isAuthenticated = !!token;

  const path = request.nextUrl.pathname;

  // Exactamente "/"
  const isHome = path === "/";

  // Rutas públicas
  const isPublicPath =
    isHome ||
    path.startsWith("/events") ||
    path.startsWith("/login") ||
    path.startsWith("/success") ||
    path.startsWith("/checkout");  // ← AGREGAR checkout como pública

  // Rutas protegidas (solo dashboard requiere login)
  const isProtectedPath =
    path.startsWith("/dashboard");

  // Usuario NO autenticado intentando entrar a protegido
  if (!isAuthenticated && isProtectedPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Usuario autenticado intentando ir a login
  if (isAuthenticated && path.startsWith("/login")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};