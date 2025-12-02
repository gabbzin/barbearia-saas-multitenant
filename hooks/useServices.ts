/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  createService,
  deleteService,
  getServicesByBarberId,
  patchService,
} from "@/app/_actions/services/service-actions";

import { BarberService } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useServicesCRUD(barberId: string) {
  const queryClient = useQueryClient();

  function updateCache(updateFn: (old: any) => any) {
    queryClient.setQueryData(["services", barberId], updateFn);
  }

  const servicesQuery = useQuery({
    queryKey: ["services", barberId],
    queryFn: () => getServicesByBarberId({ barberId }),
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) => createService(data),
    onSuccess: (newService) => {
      toast.success("Serviço criado com sucesso!");
      updateCache((oldData: BarberService[] | undefined) => {
        return oldData ? [...oldData, newService] : [newService];
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ data, serviceId }: { data: FormData; serviceId: string }) =>
      patchService({ data, serviceId }),

    onSuccess: (updatedService: BarberService) => {
      toast.success("Serviço atualizado com sucesso!");
      updateCache((oldData: BarberService[] | undefined) => {
        return oldData
          ? oldData.map((service) =>
              service.id === updatedService.id ? updatedService : service,
            )
          : [updatedService];
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (serviceId: string) => deleteService({ serviceId }),
    onSuccess: (_, serviceId) => {
      toast.success("Serviço deletado com sucesso!");
      updateCache((oldData: BarberService[] | undefined) => {
        return oldData
          ? oldData.filter((service) => service.id !== serviceId)
          : [];
      });
    },
  });

  return {
    services: servicesQuery.data,
    isLoading: servicesQuery.isLoading,
    isError: servicesQuery.isError,
    createService: createMutation.mutate,
    updateService: updateMutation.mutate,
    deleteService: deleteMutation.mutate,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
