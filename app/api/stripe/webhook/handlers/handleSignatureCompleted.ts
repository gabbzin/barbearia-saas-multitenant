import { SubscriptionStatus } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe-client";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Lógica para lidar com a finalização do checkout SUCESSO
export async function handleSignatureCompleted(
  event: Stripe.CustomerSubscriptionCreatedEvent,
) {
  const session = event.data.object;
  const date = session.metadata?.date ? new Date(session.metadata.date) : null;

  const signatureId = session.metadata?.signatureId;
  const userId = session.metadata?.userId;
  const eventId = event.id;

  const exists = await prisma.userSubscription.findUnique({
    where: {
      stripeSubscriptionId: eventId,
    },
  });

  const subscriptionId = session.id;

  if (exists) {
    return { ok: true };
  }
  if (!date || !signatureId || !userId) {
    return NextResponse.error();
  }

  const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ["payment_intent"],
  });

  const paymentIntent = expandedSession.payment_intent as Stripe.PaymentIntent;

  const chargeId =
    typeof paymentIntent.latest_charge === "string"
      ? paymentIntent.latest_charge
      : paymentIntent.latest_charge?.id;

  await prisma.userSubscription.create({
    data: {
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(
        new Date(date).setMonth(new Date(date).getMonth() + 1),
      ),
      stripeSubscriptionId: subscriptionId,
      userId,
      planId: signatureId,
      status: SubscriptionStatus.ACTIVE,
      stripeEventId: eventId,
      stripeChargeId: chargeId || null,
    },
  });
  revalidatePath("/signature");
  return { ok: true };
}
