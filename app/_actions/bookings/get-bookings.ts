"use server";

import { prisma } from "@/lib/prisma";

export async function getBookings(barberId: string) {
  return await prisma.booking.findMany({
    where: {
      status: "SCHEDULED",
      barberId: barberId,
    },
    include: {
      user: true,
      service: true,
    },
    orderBy: {
      date: "asc",
    },
  });
}
