import { revalidatePath } from "next/cache";
import type Stripe from "stripe";
import { db } from "@/lib/funcs/get-db";

// Lógica para lidar com a finalização da assinatura
export async function handleSignatureCompleted(event: Stripe.Event) {
  try {
    const subscription = event.data.object as Stripe.Subscription;

    const stripeSubscriptionId = subscription.id;
    const stripeCustomerId = subscription.customer as string;

    const userId = subscription.metadata?.userId;
    const planId =
      subscription.metadata?.planId ??
      subscription.items.data[0].price.metadata?.planId ??
      null;

    const tenantId = subscription.metadata?.tenantId ?? null;

    if (!tenantId) {
      return {
        ok: false,
        error: "Tenant ID not found in subscription metadata",
      };
    }

    if (!planId) {
      return { ok: false, error: "Plan ID not found in subscription metadata" };
    }

    if (!userId) {
      return { ok: false, error: "User ID not found in subscription metadata" };
    }

    const invoice = subscription.latest_invoice as Stripe.Invoice;

    const line = invoice.lines.data[0];

    const periodStart = new Date(line.period.start * 1000);
    const periodEnd = new Date(line.period.end * 1000);

    const mappedStatus =
      subscription.status === "active" || subscription.status === "trialing"
        ? "ACTIVE"
        : subscription.status === "canceled"
          ? "CANCELLED"
          : "INCOMPLETE";

    await db.$transaction([
      db.subscription.upsert({
        where: { userId_tenantId: { userId, tenantId } },
        update: {
          status: mappedStatus,
          planId,
          periodStart,
          periodEnd,
          stripeSubscriptionId,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          stripeCustomerId,
        },
        create: {
          status: mappedStatus,
          userId,
          planId,
          tenantId,
          periodStart,
          periodEnd,
          stripeSubscriptionId,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          stripeCustomerId,
        },
      }),

      db.user.update({
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
