"use client";

import { PlusIcon } from "lucide-react";
import CheckboxForm from "@/app/_components/form/checkbox-form";
import GenericForm from "@/app/_components/form/generic-form";
import InputForm from "@/app/_components/form/input-form";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { timesSchema } from "@/schemas/timesSchema";

const daysOptions = [
  { label: "Domingo", value: "0" },
  { label: "Segunda-feira", value: "1" },
  { label: "Terça-feira", value: "2" },
  { label: "Quarta-feira", value: "3" },
  { label: "Quinta-feira", value: "4" },
  { label: "Sexta-feira", value: "5" },
  { label: "Sábado", value: "6" },
];

export default function FormTimesServices() {
  // biome-ignore lint/suspicious/noExplicitAny: <test>
  const handleSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          Verificar horários e serviços
        </Button>
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
          schema={timesSchema}
          submitText="Salvar Configurações"
          onSubmit={handleSubmit}
        >
          <h3 className="font-semibold text-lg">Dias da Semana</h3>
          <div className="grid grid-cols-2 gap-3">
            {daysOptions.map(({ label, value }) => {
              return (
                <CheckboxForm
                  key={label}
                  label={label}
                  name={`dia_semana_${value}`}
                />
              );
            })}
          </div>

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
