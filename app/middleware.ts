import { type NextRequest, NextResponse } from "next/server";

export function Middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const subdomain = host.split(".")[0];

  if (
    subdomain === "www" ||
    subdomain === "app" ||
    host.includes("localhost")
  ) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-tenant", subdomain);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
