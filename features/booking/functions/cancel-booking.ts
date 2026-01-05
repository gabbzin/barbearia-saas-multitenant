"use server";

import { returnValidationErrors } from "next-safe-action";
import { z } from "zod";
import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";
import { db } from "@/lib/funcs/get-db";

const inputSchema = z.object({
  bookingId: z.uuid(),
});

export const cancelBooking = actionClient
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

    if (!booking) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Booking not found"],
      });
    }

    if (booking.userId !== session.id) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Unauthorized"],
      });
    }

    await db.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
      },
    });

    return { success: true };
  });
