import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ [key: string]: string | undefined }>;
}) {
  const { slug } = await params;

  const tenant = await prisma.barbershop.findUnique({
    where: { slug },
  });

  if (!tenant) {
    return notFound();
  }

  (await cookies()).set("tenantId", tenant.id);

  return <>{children}</>;
}
