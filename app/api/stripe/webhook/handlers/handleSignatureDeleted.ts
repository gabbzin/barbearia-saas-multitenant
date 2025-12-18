import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function handleSignatureDeleted(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;

  await prisma.subscription.update({
    where: {
      stripeSubscriptionId: subscription.id,
    },
    data: {
      status: "canceled",
      cancelAtPeriodEnd: false,
    },
  });
}
