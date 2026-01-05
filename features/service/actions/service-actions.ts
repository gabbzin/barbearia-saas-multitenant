"use server";

import { verifySession } from "@/features/user/repository/user.repository";
import { db } from "@/lib/funcs/get-db";

// Aqui vão as ações dos serviços do barbeiro

export async function getServicesByBarberId(data: { barberId: string }) {
  return await db.barberService.findMany({
    where: {
      barberId: data.barberId,
    },
  });
}

export async function createService(data: FormData, barberId: string) {
  const user = await verifySession();

  if (!user || user?.role === "CLIENT") {
    throw new Error("Unauthorized");
  }

  return await db.barberService.create({
    data: {
      name: data.get("name") as string,
      description: data.get("description") as string,
      priceInCents: Number(data.get("price")) * 100, // Vem em reais, converter para centavos
      imageUrl:
        "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png",
      barberId: barberId,
      tenantId: user.tenantId,
    },
  });
}

export async function patchService({
  data,
  serviceId,
}: {
  data: FormData;
  serviceId: string;
}) {
  return await db.barberService.update({
    where: {
      id: serviceId,
    },
    data: {
      name: data.get("name") as string,
      description: data.get("description") as string,
      priceInCents: Number(data.get("price")) * 100, // Vem em reais, converter para centavos
      // imageUrl: Adicionar depois que conectar o uploader
    },
  });
}

export async function deleteService({ serviceId }: { serviceId: string }) {
  await db.barberService.delete({
    where: {
      id: serviceId,
    },
  });

  return { serviceId };
}
