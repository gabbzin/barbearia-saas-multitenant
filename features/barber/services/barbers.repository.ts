import { cache } from "react";
import { db } from "@/lib/funcs/get-db";

export const getBarbers = cache(async () => {
  return await db.barber.findMany({
    include: {
      user: true,
    },
  });
});

export const getBarberById = cache(async (barberId: string) => {
  return await db.barber.findUnique({
    where: {
      id: barberId,
    },
    include: {
      user: true,
    },
  });
});
