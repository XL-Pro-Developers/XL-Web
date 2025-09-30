import { NextResponse, type NextRequest } from "next/server";

// Dummy middleware (does nothing but lets app continue)
export function middleware(req: NextRequest) {
  return NextResponse.next();
}

// Keep matcher if your app depends on middleware being present
export const config = {
  matcher: ["/admin/:path*"], // adjust paths if needed
};
