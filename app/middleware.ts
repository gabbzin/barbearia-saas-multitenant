import { type NextRequest, NextResponse } from "next/server";

export function Middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const subdomain = host.split(".")[0];

  if (["www", "app", "localhost"].includes(subdomain)) {
    return NextResponse.next();
  }
  const res = NextResponse.next();

  const currentTenantId = req.cookies.get("currentTenantId")?.value;

  if (subdomain && subdomain !== currentTenantId) {
    res.cookies.set("tenantId", subdomain, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      sameSite: "lax",
    });
  }

  return res;
}
