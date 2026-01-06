import type Stripe from "stripe";
import { db } from "@/lib/funcs/get-db";

export async function handleSignatureDeleted(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;

  await db.subscription.update({
    where: {
      id: subscription.id,
    },
    data: {
      status: "CANCELLED",
      cancelAtPeriodEnd: false,
    },
  });
}
