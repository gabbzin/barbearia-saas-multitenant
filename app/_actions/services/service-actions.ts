"use server";

import { prisma } from "@/lib/prisma";

// Aqui vão as ações dos serviços do barbeiro

export async function getServicesByBarberId(data: { barberId: string }) {
  return await prisma.barberService.findMany({
    where: {
      barberId: data.barberId,
    },
  });
}

export async function createService(data: FormData) {
  await prisma.barberService.create({
    data: {
      name: data.get("name") as string,
      description: data.get("description") as string,
      priceInCents: Number(data.get("priceInCents")),
      imageUrl:
        "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png",
      barberId: data.get("barberId") as string,
    },
  });
}

export async function patchService(data: FormData, serviceId: string) {
  await prisma.barberService.update({
    where: {
      id: serviceId,
    },
    data: {
      name: data.get("name") as string,
      description: data.get("description") as string,
      priceInCents: Number(data.get("priceInCents")),
      // imageUrl: Adicionar depois que conectar o uploader
    },
  });
}

export async function deleteService(data: { serviceId: string }) {
  await prisma.barberService.delete({
    where: {
      id: data.serviceId,
    },
  });
}
