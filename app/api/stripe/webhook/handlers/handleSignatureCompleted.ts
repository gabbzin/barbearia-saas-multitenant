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

    if (event.type === "checkout.session.completed") {
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
    } else if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as Stripe.Invoice;

      const lineItem = invoice.lines.data.find(item => item.subscription);

      if (lineItem && typeof lineItem.subscription === "string") {
        subscriptionId = lineItem.subscription;
      }

      if (!subscriptionId) {
        if ("subscription" in invoice && invoice.subscription) {
          subscriptionId = invoice.subscription as string;
        } else {
          return {
            ok: false,
            error: "Ignorado: Invoice sem vinculo de assinatura",
          };
        }
      }

      userId = invoice.metadata?.userId || null;
      planId = invoice.metadata?.planId || null;
    }

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

    const periodStart = latestInvoice.period_start
      ? new Date(latestInvoice.period_start * 1000)
      : new Date(subscription.start_date * 1000);

    const periodEnd = latestInvoice.period_end
      ? new Date(latestInvoice.period_end * 1000)
      : new Date((subscription.start_date + 30 * 24 * 60 * 60) * 1000);

    // Validação dos metadados da assinatura
    if (!userId && subscription.metadata?.userId) {
      userId = subscription.metadata.userId;
    }

    if (!userId) {
      console.error(`Erro: Assinatura ${subscriptionId} sem userId.`);
      return { ok: false, error: "User ID missing" };
    }

    if (!planId && subscription.metadata?.localPlanId) {
      planId = subscription.metadata.localPlanId;
    }

    if (!planId) {
      return { ok: false, error: "Plan ID missing" };
    }

    await prisma.$transaction([
      prisma.subscription.upsert({
        where: { userId: userId },
        create: {
          id: subscriptionId,
          userId: userId,
          plan: planId || "",
          referenceId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          stripeSubscriptionId: subscription.id,
          status: subscription.status,
          periodStart: periodStart,
          periodEnd: periodEnd,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        },
        update: {
          status: subscription.status,
          periodStart: periodStart,
          periodEnd: periodEnd,
          stripeSubscriptionId: subscription.id,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          ...(planId ? { plan: planId } : {}),
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

  revalidatePath("/signature");
  return { ok: true };
}
