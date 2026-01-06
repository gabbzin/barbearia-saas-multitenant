/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createDisponibility,
  getSettingsByBarberId,
} from "@/features/barber/actions/barber-actions";
import type { TimesSchemaData } from "@/features/booking/schema/timesSchema";

export function useSettingsBarber(barberId: string) {
  const queryClient = useQueryClient();
  const key = ["settings", barberId];

  // Hook de Busca
  const settingsQuery = useQuery({
    queryKey: key,
    queryFn: () => getSettingsByBarberId({ barberId }),
  });

  // Mutation Única para Salvar (Já que é Upsert, Criar e Editar são a mesma ação)
  const saveSettingsMutation = useMutation({
    mutationFn: (data: TimesSchemaData) => createDisponibility(data, barberId),

    onSuccess: () => {
      toast.success("Horários salvos com sucesso!");

      queryClient.invalidateQueries({ queryKey: key });
    },
    onError: () => {
      toast.error("Erro ao salvar configurações.");
    },
  });

  return {
    settings: settingsQuery.data,
    isLoading: settingsQuery.isLoading,
    isError: settingsQuery.isError,
    saveSettings: saveSettingsMutation.mutateAsync,
    isSaving: saveSettingsMutation.isPending,
  };
}
