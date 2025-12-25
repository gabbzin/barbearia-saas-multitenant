"use server";

import type { TimesSchemaData } from "@/features/booking/schema/timesSchema";
import { prisma } from "@/lib/prisma";

// Aqui vão as ações dos serviços do barbeiro

export async function getSettingsByBarberId({
  barberId,
}: {
  barberId: string;
}) {
  try {
    const settings = await prisma.disponibility.findFirst({
      where: {
        barberId: barberId,
      },
    });
    return settings;
  } catch (error) {
    console.error("Erro no Prisma:", error);
    throw new Error("Não foi possível buscar as configurações.");
  }
}

export async function createDisponibility(
  data: TimesSchemaData,
  barberId: string,
) {
  const selectedDates: number[] = [];

  for (let i = 0; i <= 6; i++) {
    if (data[i.toString() as "0" | "1" | "2" | "3" | "4" | "5" | "6"]) {
      selectedDates.push(i);
    }
  }

  const startTime = data.horario_abertura;
  const endTime = data.horario_fechamento;

  return await prisma.disponibility.upsert({
    where: {
      barberId: barberId,
    },
    create: {
      daysOfWeek: selectedDates,
      barberId: barberId,
      startTime: startTime,
      endTime: endTime,
    },
    update: {
      daysOfWeek: selectedDates,
      startTime: startTime,
      endTime: endTime,
    },
  });
}
