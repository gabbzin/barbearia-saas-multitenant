import { revalidatePath } from "next/cache";
import type Stripe from "stripe";
import { db } from "@/lib/funcs/get-db";
import { prisma } from "@/lib/prisma";
import { stripeClient } from "@/lib/stripe-client";

// Lógica para lidar com a finalização do checkout SUCESSO
export async function handleCheckoutCompleted(
  event: Stripe.CheckoutSessionCompletedEvent,
) {
  try {
    const session = event.data.object;
    const date = session.metadata?.date
      ? new Date(session.metadata.date)
      : null;

    const serviceId = session.metadata?.serviceId;
    const userId = session.metadata?.userId;
    const eventId = event.id;
    const barberId = session.metadata?.barberId;
    const tenantId = session.metadata?.tenantId;

    const exists = await db.booking.findUnique({
      where: {
        stripeEventId: eventId,
      },
    });

    if (exists) {
      return { ok: true };
    }
    if (!date || !serviceId || !userId || !barberId || !tenantId) {
      return { ok: false };
    }

    const expandedSession = await stripeClient.checkout.sessions.retrieve(
      session.id,
      {
        expand: ["payment_intent"],
      },
    );

    const paymentIntent =
      expandedSession.payment_intent as Stripe.PaymentIntent;

    const chargeId =
      typeof paymentIntent.latest_charge === "string"
        ? paymentIntent.latest_charge
        : paymentIntent.latest_charge?.id;

    await prisma.booking.create({
      data: {
        serviceId,
        date,
        userId,
        barberId,
        tenantId,
        stripeChargeId: chargeId || null,
        stripeEventId: eventId,
        priceInCents: session.amount_total ?? 0,
      },
    });

    const tenant = await prisma.barbershop.findUnique({
      where: { id: tenantId },
      select: { slug: true },
    });

    if (tenant) {
      revalidatePath(`/${tenant.slug}/bookings`);
    }

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
