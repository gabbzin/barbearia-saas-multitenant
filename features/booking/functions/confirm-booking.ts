"use server";

import { db } from "@/lib/funcs/get-db";

export async function confirmBooking(bookingId: string) {
  return await db.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: "COMPLETED",
    },
  });
}
