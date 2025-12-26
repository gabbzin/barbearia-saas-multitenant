"use server";

import { headers } from "next/headers";
import { returnValidationErrors } from "next-safe-action";
import { z } from "zod";
import { actionClient } from "@/lib/actionClient";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripeClient } from "@/lib/stripe-client";

const inputSchema = z.object({
  signatureId: z.uuid(),
});

export const cancelSignature = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { signatureId } }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Unauthorized"],
      });
    }

    const signature = await prisma.subscription.findUnique({
      where: {
        id: signatureId,
      },
    });

    if (!signature || !signature.stripeSubscriptionId) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Signature not found"],
      });
    }

    if (signature.userId !== session.user.id) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Unauthorized"],
      });
    }

    await stripeClient.subscriptions.update(signature.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    return { success: true };
  });
