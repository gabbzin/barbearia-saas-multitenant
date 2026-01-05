"use server";

import { returnValidationErrors } from "next-safe-action";
import { z } from "zod";
import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";
import { db } from "@/lib/funcs/get-db";
import { stripeClient } from "@/lib/stripe-client";

const inputSchema = z.object({
  bookingId: z.uuid(),
});

export const cancelBookingCheckoutSession = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { bookingId } }) => {
    const session = await verifySession();

    if (!session) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Unauthorized"],
      });
    }

    const booking = await db.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

    if (!booking || booking.stripeChargeId === null) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Booking not found"],
      });
    }

    if (booking.userId !== session.id) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Unauthorized"],
      });
    }

    try {
      await stripeClient.refunds.create({
        charge: booking.stripeChargeId,
      });
      // biome-ignore lint/suspicious/noExplicitAny: <Erro não tem tipagem explicita>
    } catch (err: any) {
      return returnValidationErrors(inputSchema, {
        _errors: [err.message || "Erro ao processar reembolso"],
      });
    }

    return { success: true };
  });
