"use server";

import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/get-db";
import { prisma } from "@/lib/prisma";

export const verifySession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  const role = await prisma.userTenant.findUnique({
    where: {
      userId_tenantId: {
        userId: session.user.id,
        tenantId: session.session.tenantId,
      },
    },
    select: {
      role: true,
    },
  });

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    tenantId: session.session.tenantId,
    role: role?.role,
    stripeCustomerId: session.user.stripeCustomerId,
  };
});

export type SubscriptionInfo = {
  hasPlan: boolean;
  name: string | null;
  validUntil?: string | null;
};

const PLAN: SubscriptionInfo = {
  hasPlan: false,
  name: null,
  validUntil: null,
};

export const getCurrentSubscription = cache(async () => {
  const session = await verifySession();

  if (!session) {
    return PLAN;
  }

  return isSubscriber(session.id, session.tenantId);
});

export const isSubscriber = cache(
  async (
    userId: string | undefined,
    tenantId: string | undefined,
  ): Promise<SubscriptionInfo> => {
    if (!userId || !tenantId) {
      return PLAN;
    }
    const sub = await db.subscription.findUnique({
      where: {
        userId_tenantId: {
          userId,
          tenantId,
        },
      },
      select: {
        periodEnd: true,
        plan: {
          select: {
            name: true,
          },
        },
      },
    });

    return sub?.plan
      ? {
          hasPlan: sub.plan.name !== "FREE",
          name: sub.plan.name,
          validUntil: sub.periodEnd?.toISOString() || null,
        }
      : PLAN;
  },
);
