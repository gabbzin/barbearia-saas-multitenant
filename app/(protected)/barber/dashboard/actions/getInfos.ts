"use server";

import { endOfDay, startOfDay } from "date-fns";
import z from "zod";
import { actionClient } from "@/lib/actionClient";
import { prisma } from "@/lib/prisma";
import { convertBRL } from "@/utils/convertBRL";

const inputSchema = z.object({
  barberId: z.string(),
});

export const getBarberDashboardInfos = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { barberId } }) => {
    try {
      const now = new Date();
      const startOfDayDate = startOfDay(now);
      const endOfDayDate = endOfDay(now);

      const requests = Promise.allSettled([
        // Próximo agendamento
        prisma.booking.findFirst({
          where: {
            barberId: barberId,
            date: {
              gte: startOfDayDate,
            },
            status: "SCHEDULED",
          },
          include: {
            service: true,
            user: true,
          },
          orderBy: {
            date: "asc",
          },
        }),

        // Faturamento e atendimentos realizados hoje
        prisma.booking.aggregate({
          _sum: {
            priceInCents: true,
          },
          _count: {
            id: true,
          },
          where: {
            barberId: barberId,
            date: {
              gte: startOfDayDate,
              lte: endOfDayDate,
            },
            status: "COMPLETED",
          },
        }),

        // Agendamentos para hoje
        prisma.booking.count({
          where: {
            barberId: barberId,
            date: {
              gte: startOfDayDate,
            },
            status: "SCHEDULED",
          },
        }),
      ]);

      const results = await requests;

      const nextBooking =
        results[0].status === "fulfilled" ? results[0].value : null;

      const billing =
        results[1].status === "fulfilled"
          ? results[1].value
          : { _sum: { priceInCents: 0 }, _count: { id: 0 } };

      const totalSchedules =
        results[2].status === "fulfilled" ? results[2].value : 0;

      const todayBilling = convertBRL(billing._sum.priceInCents ?? 0);
      const servicesPerformed = billing._count.id ?? 0;

      return {
        nextBooking,
        billing,
        todayBilling,
        totalSchedules,
        servicesPerformed,
      };
    } catch (error) {
      console.error("Error fetching barber dashboard infos:", error);
      throw error;
    }
  });
