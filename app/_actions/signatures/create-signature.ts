"use server";

import { SubscriptionStatus } from "@prisma/client";
import { returnValidationErrors } from "next-safe-action";
import z from "zod";
import { actionClient } from "@/lib/actionClient";
import { prisma } from "@/lib/prisma";
import { stripeClient } from "@/lib/stripe-client";
import { verifySession } from "@/utils/verifySession";

const inputSchema = z.object({
  signatureId: z.uuid(),
});

export const createSignature = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { signatureId } }) => {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe secret key is not configured.");
    }

    const user = await verifySession();

    if (!user) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Não autorizado."],
      });
    }

    const hasActiveSubscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: SubscriptionStatus.ACTIVE.toLowerCase(),
      },
    });

    if (hasActiveSubscription) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Você já possui uma assinatura ativa."],
      });
    }

    const signature = await prisma.subscriptionPlan.findUnique({
      where: {
        id: signatureId,
      },
    });

    if (!signature) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Assinatura não encontrada."],
      });
    }

    let customerConfig = {};

    const userRecord = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (userRecord?.stripeCustomerId) {
      customerConfig = { customer: userRecord.stripeCustomerId };
    } else {
      customerConfig = {
        customer_email: user.email,
      };
    }

    try {
      const checkoutSession = await stripeClient.checkout.sessions.create({
        ...customerConfig,
        mode: "subscription",
        payment_method_types: ["card"],
        subscription_data: {
          metadata: {
            userId: user.id,
            planId: signature.id,
          },
        },
        line_items: [
          {
            price: signature.stripePriceId,
            quantity: 1,
          },
        ],

        metadata: {
          userId: user.id,
          planId: signature.id,
        },

        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}`, // Criar a página de sucesso
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
      });

      if (!checkoutSession.url) {
        throw new Error("Erro ao gerar link de pagamento.");
      }

      return { url: checkoutSession.url };
    } catch (error) {
      console.error("Erro ao criar sessão de checkout:", error);
      return returnValidationErrors(inputSchema, {
        _errors: ["Erro ao criar sessão de checkout."],
      });
    }
  });
