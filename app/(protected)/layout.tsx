import { SubscriptionStatus } from "@prisma/client";
import { verifySession } from "@/features/user/repository/user.repository";
import { prisma } from "@/lib/prisma";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const session = await verifySession();

  const plans = await prisma.plan.findFirstOrThrow({
    where: {
      name: "FREE",
    },
  });

  if (session?.id) {
    await prisma.subscription.upsert({
      where: { userId: session.id },
      create: {
        userId: session.id,
        planId: plans.id,
        status: SubscriptionStatus.ACTIVE,
        periodStart: new Date(),
        // Plano gratuito sem data de término
        periodEnd: null,
      },
      update: {},
    });
  }

  return <>{children}</>;
}
