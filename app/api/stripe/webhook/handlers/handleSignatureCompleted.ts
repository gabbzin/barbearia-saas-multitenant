import { SubscriptionStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";

// Lógica para lidar com a finalização da assinatura
export async function handleSignatureCompleted(
  event: Stripe.CustomerSubscriptionCreatedEvent,
) {
  try {
    const subscription = event.data.object;
    const subscriptionId = subscription.id;
    const eventId = event.id;

    const signatureId = subscription.metadata?.signatureId;
    const userId = subscription.metadata?.userId;

    const exists = await prisma.userSubscription.findUnique({
      where: {
        stripeSubscriptionId: subscriptionId,
      },
    });

    if (exists) {
      return { ok: true };
    }

    if (!signatureId || !userId) {
      return { ok: false };
    }

    const currentPeriodStart = new Date();
    const currentPeriodEnd = new Date();
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

    await prisma.userSubscription.create({
      data: {
        currentPeriodStart,
        currentPeriodEnd,
        stripeSubscriptionId: subscriptionId,
        userId,
        planId: signatureId,
        status: SubscriptionStatus.ACTIVE,
        stripeEventId: eventId,
        stripeChargeId: null,
      },
    });

    revalidatePath("/signature");
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
