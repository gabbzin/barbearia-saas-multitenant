"use server";

import { prisma } from "@/lib/prisma";

export async function getBookingsBarber(barberId: string) {
  const startDay = new Date().setHours(0, 0, 0, 0);
  const endDay = new Date().setHours(23, 59, 59, 999);

  return await prisma.booking.findMany({
    where: {
      barberId: barberId,
      date: {
        gte: new Date(startDay),
        lte: new Date(endDay),
      },
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

export async function getBookingsUser(userId: string) {
  return await prisma.booking.findMany({
    where: {
      userId: userId,
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
