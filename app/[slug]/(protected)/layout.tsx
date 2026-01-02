import { redirect } from "next/navigation";
import { verifySession } from "@/features/user/repository/user.repository";
import { prisma } from "@/lib/prisma";

export default async function ProtectedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const session = await verifySession();

  if (!session) {
    return redirect(`/${slug}/login`);
  }

  const memberShip = await prisma.userTenant.findUnique({
    where: {
      userId_tenantId: {
        tenantId: session.tenantId,
        userId: session.id,
      },
    },
  });

  if (!memberShip) {
    return redirect(`/${slug}/login`);
  }

  return <>{children}</>;
}
