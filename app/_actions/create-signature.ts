"use server";

import { SubscriptionStatus } from "@/generated/prisma";
import { actionClient } from "@/lib/actionClient";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe-client";
import { verifySession } from "@/utils/verifySession";
import { returnValidationErrors } from "next-safe-action";
import z from "zod";

const inputSchema = z.object({
  signatureId: z.uuid(),
  date: z.date(),
});

export const createSignature = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { date, signatureId } }) => {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe secret key is not configured.");
    }

    const user = await verifySession();

    if (!user) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Não autorizado."],
      });
    }

    const isActiveSignature = await prisma.userSubscription.findFirst({
      where: {
        userId: user.id,
        status: SubscriptionStatus.ACTIVE,
      },
    });

    if (isActiveSignature) {
      return returnValidationErrors(inputSchema, {
        _errors: ["O usuário já possui uma assinatura ativa."],
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

    const checkoutSession = await stripe.checkout.sessions.create({
      // payment_method_types: ["card"],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}`, // Depois criar uma página de sucesso
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
      metadata: {
        userId: user.id,
        signatureId: signatureId,
        date: date.toISOString(),
      },
      line_items: [
        {
          price_data: {
            currency: "brl",
            unit_amount: signature.priceInCents,
            recurring: {
              interval: "month",
              interval_count: 1,
            },
            product_data: {
              name: signature.name,
              description: signature.description,
              // images: [signature.imageUrl], Adicionar depois
            },
          },
          quantity: 1,
        },
      ],
    });

    return { url: checkoutSession.url };
  });
