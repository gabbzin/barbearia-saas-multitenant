import { cookies } from "next/headers";

export async function getTenantIdByCookie() {
  const cookieStore = await cookies();
  const tenantId = cookieStore.get("tenantId")?.value;

  if (tenantId) {
    return tenantId;
  }

  return null;
}