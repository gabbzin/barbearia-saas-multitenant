"use server";

import { endOfDay, format, startOfDay } from "date-fns";
import { date, object, string } from "zod";
import { actionClient } from "@/lib/actionClient";
import { db } from "@/lib/funcs/get-db";

const inputSchema = object({
  barberId: string(),
  date: date(),
});

const timeToMinutes = (time: Date) => {
  return time.getHours() * 60 + time.getMinutes();
};

// Função para converter minutos de volta para "HH:mm"
const minutesToTime = (minutes: number) => {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
};

export const getDateAvailableTimeSlots = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { barberId, date } }) => {
    // lógica para buscar horários disponíveis para o serviço na data fornecida
    // const session = await verifySession();

    // if (!session) {
    //   return returnValidationErrors(inputSchema, {
    //     _errors: ["Unauthorized"],
    //   });
    // }

    const bookings = await db.booking.findMany({
      where: {
        service: {
          barberId: barberId,
        },
        date: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
        status: { not: "CANCELLED" },
      },
      select: {
        date: true,
      },
    });

    const day = date.getDay(); // 0 (Domingo) a 6 (Sábado)

    const availability = await db.barberDisponibility.findFirst({
      where: {
        barberId,
        dayOfWeek: day,
      },
      select: {
        dayOfWeek: true,
        startTime: true,
        endTime: true,
      },
    });

    if (!availability) {
      return [];
    }
    if (availability.dayOfWeek !== day) {
      return [];
    }

    const occupiedSlots = bookings.map(b => format(b.date, "HH:mm"));

    const start = timeToMinutes(availability.startTime);
    const end = timeToMinutes(availability.endTime);
    const interval = 30;

    const dynamicSlots: string[] = [];

    for (let time = start; time <= end; time += interval) {
      const timeString = minutesToTime(time);
      if (!occupiedSlots.includes(timeString)) {
        dynamicSlots.push(timeString);
      }
    }

    return dynamicSlots;
  });
