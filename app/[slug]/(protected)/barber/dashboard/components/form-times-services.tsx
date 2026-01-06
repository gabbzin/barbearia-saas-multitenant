"use client";

import { format } from "date-fns";
import { PencilIcon, ScissorsIcon } from "lucide-react";
import { useState } from "react";
import { useSettingsBarber } from "@/features/barber/settings/useSettingsBarber";
import {
  type TimesSchemaData,
  timesSchema,
} from "@/features/booking/schema/timesSchema";
import CheckboxForm from "@/shared/components/form/checkbox-form";
import GenericForm from "@/shared/components/form/generic-form";
import InputForm from "@/shared/components/form/input-form";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";

const daysOptions = [
  { label: "Domingo", value: false, index: 0 },
  { label: "Segunda-feira", value: false, index: 1 },
  { label: "Terça-feira", value: false, index: 2 },
  { label: "Quarta-feira", value: false, index: 3 },
  { label: "Quinta-feira", value: false, index: 4 },
  { label: "Sexta-feira", value: false, index: 5 },
  { label: "Sábado", value: false, index: 6 },
];

interface FormTimesServicesProps {
  barberId: string;
  settings?: {
    barberId: string;
    id: string;
    tenantId: string;
    dayOfWeek: number;
    startTime: Date;
    endTime: Date;
  };
}

export default function FormTimesServices({
  barberId,
  settings,
}: FormTimesServicesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { saveSettings } = useSettingsBarber(barberId);

  const isEditing = !!settings;

  const defaultValues = {
    horario_abertura: format(settings?.startTime ?? new Date(), "HH:mm"),
    horario_fechamento: format(settings?.endTime ?? new Date(), "HH:mm"),
    "0": settings?.dayOfWeek === 0,
    "1": settings?.dayOfWeek === 1,
    "2": settings?.dayOfWeek === 2,
    "3": settings?.dayOfWeek === 3,
    "4": settings?.dayOfWeek === 4,
    "5": settings?.dayOfWeek === 5,
    "6": settings?.dayOfWeek === 6,
  };

  const handleSubmit = async (data: TimesSchemaData) => {
    try {
      await saveSettings(data);
      setIsOpen(false);
    } catch (e) {
      console.error("Erro ao salvar", e);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button variant={"secondary"}>
            <PencilIcon />
          </Button>
        ) : (
          <div className="flex items-center justify-end gap-3">
            <span className="rounded bg-primary/90 px-2 py-1 text-background">
              Configurar horários
            </span>
            <Button
              size="icon"
              variant="secondary"
              className="h-14 w-14 rounded-full shadow-lg"
            >
              <ScissorsIcon className="size-4" />
            </Button>
          </div>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold text-xl">
            Configurações de Horários
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Defina os dias e horários de atendimento disponíveis para seus
            clientes.
          </DialogDescription>
        </DialogHeader>
        <GenericForm
          defaultValues={isEditing ? defaultValues : undefined}
          schema={timesSchema}
          submitText="Salvar Configurações"
          onSubmit={handleSubmit}
        >
          {isEditing ? (
            <div className="mb-4 text-center">
              Configurando horário para
              <br />
              <span className="font-bold">
                {daysOptions[settings?.dayOfWeek ?? 0].label}
              </span>
            </div>
          ) : (
            <>
              <h3 className="font-semibold text-lg">Dias da Semana</h3>
              <div className="grid grid-cols-2 gap-3">
                {daysOptions.map(({ label, index }) => {
                  return (
                    <CheckboxForm key={label} label={label} name={`${index}`} />
                  );
                })}
              </div>
            </>
          )}
          <InputForm
            name="horario_abertura"
            placeholder="Horário de abertura"
            label="Horário de Inicio"
            type="time"
          />

          <InputForm
            name="horario_fechamento"
            placeholder="Horário de fechamento"
            label="Horário de Fechamento"
            type="time"
          />
        </GenericForm>
      </DialogContent>
    </Dialog>
  );
}
