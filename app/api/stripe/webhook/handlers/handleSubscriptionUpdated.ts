import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export async function handleSubscriptionUpdated(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;

  const userId = subscription.metadata.userId;
  if (!userId) return;

  const planId =
    subscription.items.data[0].price.metadata?.planId ??
    subscription.metadata.planId;

  const mappedStatus =
    subscription.status === "active" || subscription.status === "trialing"
      ? "ACTIVE"
      : subscription.status === "canceled"
        ? "CANCELLED"
        : "INCOMPLETE";

  await prisma.subscription.update({
    where: { userId },
    data: {
      planId,
      status: mappedStatus,
      stripeSubscriptionId: subscription.id,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      stripeCustomerId: subscription.customer as string,
    },
  });
}
