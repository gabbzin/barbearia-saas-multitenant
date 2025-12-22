import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripeClient } from "@/lib/stripe-client";

export async function handleInvoicePaid(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice;

  // Na versão 20, a assinatura está em parent.subscription_details.subscription
  const stripeSubscriptionId =
    invoice.parent?.subscription_details?.subscription;

  if (!stripeSubscriptionId || typeof stripeSubscriptionId === "object") {
    console.log("ID da assinatura ausente ou em formato inválido", { invoice });
    return;
  }

  try {
    // Buscar a assinatura para obter os metadados e períodos
    const subscription =
      await stripeClient.subscriptions.retrieve(stripeSubscriptionId);

    const userId = subscription.metadata.userId;
    const planId = subscription.metadata.planId;

    if (!userId || !planId) {
      console.log("Metadados obrigatórios ausentes na assinatura", {
        subscription,
      });
      return;
    }

    const periodStart = new Date(invoice.lines.data[0].period.start * 1000);
    const periodEnd = new Date(invoice.lines.data[0].period.end * 1000);

    // Atualizar a assinatura no banco de dados
    await prisma.subscription.update({
      where: { userId },
      data: {
        stripeSubscriptionId,
        stripeCustomerId: invoice.customer as string,
        planId,
        periodStart,
        periodEnd,
        status: "ACTIVE",
      },
    });

    console.log(
      `Assinatura atualizada com sucesso para o usuário ${userId}, plano ${planId}`,
    );
  } catch (error) {
    console.error("Erro ao processar pagamento de fatura", error);
    // Implementar tratamento de erro conforme discutido anteriormente
  }
}
