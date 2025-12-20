import { revalidatePath } from "next/cache";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripeClient } from "@/lib/stripe-client";

// Lógica para lidar com a finalização da assinatura
export async function handleSignatureCompleted(event: Stripe.Event) {
  try {
    let subscriptionId: string | null = null;
    let userId: string | null = null;
    let planId: string | null = null;

    const session = event.data.object as Stripe.Checkout.Session;

    if (typeof session.subscription === "string") {
      subscriptionId = session.subscription;
    } else if (
      session.subscription &&
      typeof session.subscription === "object"
    ) {
      subscriptionId = session.subscription.id;
    }

    userId = session.metadata?.userId || null;
    planId = session.metadata?.planId || null;

    if (!subscriptionId) {
      return { ok: false, error: "Ignorado: Sem ID de assinatura" };
    }
    // Busca na STRIPE com Expand

    const subscription = await stripeClient.subscriptions.retrieve(
      subscriptionId,
      {
        expand: ["latest_invoice"],
      },
    );

    let periodStart: Date;
    let periodEnd: Date | null = null;

    if (
      subscription.latest_invoice &&
      typeof subscription.latest_invoice === "object" &&
      "lines" in subscription.latest_invoice &&
      subscription.latest_invoice.lines.data.length > 0
    ) {
      const line = subscription.latest_invoice.lines.data[0];
      periodStart = new Date(line.period.start * 1000);
      periodEnd = new Date(line.period.end * 1000);
    } else {
      periodStart = new Date(subscription.start_date * 1000);
    }

    // Validação dos metadados da assinatura
    if (!userId && subscription.metadata?.userId) {
      userId = subscription.metadata.userId;
    }

    if (!userId) {
      console.error(`Erro: Assinatura ${subscriptionId} sem userId.`);
      return { ok: false, error: "User ID missing" };
    }

    if (!planId && subscription.metadata?.planId) {
      planId = subscription.metadata.planId;
    }

    if (!planId) {
      return { ok: false, error: "Plan ID missing" };
    }

    const mappedStatus =
      subscription.status === "active" || subscription.status === "trialing"
        ? "ACTIVE"
        : subscription.status === "canceled"
          ? "CANCELLED"
          : "INCOMPLETE";

    const stripeCustomerId = subscription.customer as string;

    await prisma.$transaction([
      prisma.subscription.upsert({
        where: { userId },
        update: {
          status: mappedStatus,
          planId,
          periodStart,
          periodEnd,
          stripeSubscriptionId: subscription.id,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          stripeCustomerId,
        },
        create: {
          status: mappedStatus,
          userId,
          planId: planId,
          periodStart,
          periodEnd,
          stripeSubscriptionId: subscription.id,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          stripeCustomerId,
        },
      }),

      prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId },
      }),
    ]);
    revalidatePath("/dashboard");
    return { ok: true };
  } catch (error) {
    console.error(
      "Erro ao processar evento de finalização de checkout:",
      error,
    );
    return {
      ok: false,
      error: "Erro ao processar evento de finalização de checkout",
    };
  }
}
