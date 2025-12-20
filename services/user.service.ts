"use server";

import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PLAN = {
  isSubscriber: false,
  name: null,
};

export const verifySession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role,
  };
});

type SubscriptionInfo = {
  isSubscriber: boolean;
  name: string | null;
};

export const getCurrentSubscription = cache(async () => {
  const session = await verifySession();
  
  if (!session) {
    return PLAN;
  }

  return isSubscriber(session.id);
});

export const isSubscriber = cache(
  async (userId: string | undefined): Promise<SubscriptionInfo> => {
    if (!userId) {
      return PLAN;
    }
    const userRound = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        subscription: true,
      },
    });

    return userRound?.subscription
      ? { isSubscriber: true, name: userRound.subscription.plan }
      : PLAN;
  },
);
