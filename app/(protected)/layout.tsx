import { SubscriptionStatusType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/services/user.service";

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
        status: SubscriptionStatusType.ACTIVE,
        periodStart: new Date(),
        // Plano gratuito sem data de término
        periodEnd: null,
      },
      update: {},
    });
  }

  return <>{children}</>;
}
