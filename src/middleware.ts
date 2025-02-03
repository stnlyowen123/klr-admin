import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const runtime = "nodejs"; // Gunakan runtime Node.js

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"], // Terapkan middleware hanya ke halaman frontend
};

export function middleware(request: NextRequest) {
  const user = request.cookies.get("user");

  // Redirect ke halaman login jika belum login
  if (!user && !request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect ke halaman utama jika sudah login dan mengakses halaman login
  if (user && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
