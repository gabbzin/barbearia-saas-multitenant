"use client";

import { getServicesByBarberId } from "@/app/_actions/services/service-actions";
import { useQuery } from "@tanstack/react-query";

export function useServices(barberId: string) {
  return useQuery({
    queryKey: ["services", barberId],
    queryFn: () => getServicesByBarberId({ barberId }),
  });
}
