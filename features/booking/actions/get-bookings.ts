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

export async function getNextBooking(userId: string) {
  return await prisma.booking.findFirst({
    where: {
      userId: userId,
      status: "SCHEDULED",
      date: {
        gt: new Date(),
      },
    },
    include: {
      service: {
        include: {
          barber: {
            include: {
              user: true,
            },
          },
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  });
}
