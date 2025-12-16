"use server";

import { prisma } from "@/lib/prisma";

export async function confirmBooking(bookingId: string) {
  return await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: "COMPLETED",
    },
  });
}
