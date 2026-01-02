"use server";

import { cookies } from "next/headers";

export async function setTenantCookie(tenantId: string) {
  const cookieStore = await cookies();

  cookieStore.set("tenantId", tenantId, {
    path: "/",
    maxAge: 60 * 60, // 1 hora
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: false,
  });
}
