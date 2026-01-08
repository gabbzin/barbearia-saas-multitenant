import { redirect } from "next/navigation";
import { verifySession } from "@/features/user/repository/user.repository";
import { prisma } from "@/lib/prisma";
import Footer from "@/shared/components/footer";
import Header from "@/shared/components/header";

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

  return (
    <main className="flex min-h-screen flex-col justify-between">
      <Header />
      {children}
      <Footer />
    </main>
  );
}
