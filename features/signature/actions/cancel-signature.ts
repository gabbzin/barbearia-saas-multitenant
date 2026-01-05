"use server";

import { returnValidationErrors } from "next-safe-action";
import { z } from "zod";
import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";
import { db } from "@/lib/funcs/get-db";
import { stripeClient } from "@/lib/stripe-client";

const inputSchema = z.object({
  signatureId: z.uuid(),
});

export const cancelSignature = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { signatureId } }) => {
    const session = await verifySession();

    if (!session) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Unauthorized"],
      });
    }

    const signature = await db.subscription.findUnique({
      where: {
        id: signatureId,
      },
    });

    if (!signature || !signature.stripeSubscriptionId) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Signature not found"],
      });
    }

    if (signature.userId !== session.id) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Unauthorized"],
      });
    }

    await stripeClient.subscriptions.update(signature.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    return { success: true };
  });
