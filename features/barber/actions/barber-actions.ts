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
    const settings = await prisma.barberDisponibility.findMany({
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

  const startTime = new Date(data.horario_abertura);
  const endTime = new Date(data.horario_fechamento);

  for (const day of selectedDates) {
    if (startTime >= endTime) {
      throw new Error(
        `No dia ${day}, o horário de abertura deve ser antes do horário de fechamento.`,
      );
    }
    await prisma.barberDisponibility.upsert({
      where: {
        barberId_dayOfWeek: {
          barberId,
          dayOfWeek: day,
        },
      },
      create: {
        dayOfWeek: day,
        barberId,
        startTime,
        endTime,
      },
      update: {
        dayOfWeek: day,
        startTime,
        endTime,
      },
    });
  }
}
