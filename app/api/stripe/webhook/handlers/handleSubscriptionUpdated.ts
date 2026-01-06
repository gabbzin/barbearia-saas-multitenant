import type Stripe from "stripe";
import { db } from "@/lib/funcs/get-db";

export async function handleSubscriptionUpdated(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;

  const userId = subscription.metadata.userId;
  if (!userId) return;

  const planId =
    subscription.items.data[0].price.metadata?.planId ??
    subscription.metadata.planId;

  const tenantId = subscription.metadata.tenantId;

  if (!planId || !tenantId) return;

  const mappedStatus =
    subscription.status === "active" || subscription.status === "trialing"
      ? "ACTIVE"
      : subscription.status === "canceled"
        ? "CANCELLED"
        : "INCOMPLETE";

  await db.subscription.update({
    where: { userId_tenantId: { userId, tenantId } },
    data: {
      planId,
      status: mappedStatus,
      stripeSubscriptionId: subscription.id,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      stripeCustomerId: subscription.customer as string,
    },
  });
}
