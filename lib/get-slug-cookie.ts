import { cookies } from "next/headers";
import { prisma } from "./prisma";

export async function getSlugByCookie() {
  const cookieStore = await cookies();
  const tenantSlug = cookieStore.get("tenantSlug")?.value;

  if (tenantSlug) {
    return tenantSlug;
  }

  const tenantId = cookieStore.get("tenantId")?.value;

  const tenant = await prisma.barbershop.findUnique({
    where: {
      id: tenantId,
    },
    select: {
      slug: true,
    },
  });

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  return tenant.slug;
}
