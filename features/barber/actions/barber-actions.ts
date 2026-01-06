"use server";

import type { TimesSchemaData } from "@/features/booking/schema/timesSchema";
import { verifySession } from "@/features/user/repository/user.repository";
import { db } from "@/lib/funcs/get-db";

// Aqui vão as ações dos serviços do barbeiro

export async function getSettingsByBarberId({
  barberId,
}: {
  barberId: string;
}) {
  try {
    const settings = await db.barberDisponibility.findMany({
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
  const session = await verifySession();

  if (!session || session?.role !== "BARBER") {
    throw new Error("Ação não autorizada.");
  }

  for (let i = 0; i <= 6; i++) {
    if (data[i.toString() as "0" | "1" | "2" | "3" | "4" | "5" | "6"]) {
      selectedDates.push(i);
    }
  }

  await db.barberDisponibility.deleteMany({
    where: {
      barberId,
    },
  });

  const startTime = new Date(`1970-01-01T${data.horario_abertura}:00`);
  const endTime = new Date(`1970-01-01T${data.horario_fechamento}:00`);

  for (const day of selectedDates) {
    if (startTime >= endTime) {
      throw new Error(
        `No dia ${day}, o horário de abertura deve ser antes do horário de fechamento.`,
      );
    }
    await db.barberDisponibility.upsert({
      where: {
        barberId_dayOfWeek: {
          barberId,
          dayOfWeek: day,
        },
      },
      create: {
        tenantId: session.tenantId,
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

export async function deleteDisponibility(barberId: string, dayOfWeek: number) {
  const session = await verifySession();

  if (!session || session?.role !== "BARBER") {
    throw new Error("Ação não autorizada.");
  }

  await db.barberDisponibility.delete({
    where: {
      barberId_dayOfWeek: {
        barberId,
        dayOfWeek,
      },
    },
  });
}
