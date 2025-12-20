"use server";

import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

export const isSubscriber = cache(
  async (userId: string | undefined): Promise<SubscriptionInfo> => {
    const plan = {
      isSubscriber: false,
      name: null,
    };

    if (!userId) {
      return plan;
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
      : plan;
  },
);
