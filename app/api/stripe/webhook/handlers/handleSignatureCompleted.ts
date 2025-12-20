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

    const latestInvoice = subscription.latest_invoice as Stripe.Invoice;

    const periodStart = latestInvoice.lines.data[0].period?.start
      ? new Date(latestInvoice.lines.data[0].period.start * 1000)
      : new Date(subscription.start_date * 1000);

    const periodEnd = latestInvoice.lines.data[0].period?.end
      ? new Date(latestInvoice.lines.data[0].period.end * 1000)
      : null;

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

    await prisma.$transaction([
      prisma.subscription.update({
        where: { userId },
        data: {
          status: "ACTIVE",
          planId: planId,
          periodStart: periodStart,
          periodEnd: periodEnd,
          stripeSubscriptionId: subscription.id,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        },
      }),

      prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: subscription.customer as string },
      }),
    ]);
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

  revalidatePath("/dashboard");
  return { ok: true };
}
