import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export async function handleSignatureDeleted(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;

  await prisma.subscription.update({
    where: {
      id: subscription.id,
    },
    data: {
      status: "CANCELLED",
      cancelAtPeriodEnd: false,
    },
  });
}
