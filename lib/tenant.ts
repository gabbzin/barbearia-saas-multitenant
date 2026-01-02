import { headers } from "next/headers";
import { prisma } from "./prisma";

export async function getTenant() {
  const tenantSlug = (await headers()).get("x-tenant");

  if (!tenantSlug) {
    throw new Error("Tenant not found");
  }

  const tenant = await prisma.barbershop.findUnique({
    where: {
      slug: tenantSlug,
    },
  });

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  return tenant;
}
