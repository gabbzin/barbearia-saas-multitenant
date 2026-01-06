/** biome-ignore-all lint/suspicious/noArrayIndexKey: <Tá> */
"use client";

import { format } from "date-fns";
import { Trash2Icon } from "lucide-react";
import { deleteDisponibility } from "@/features/barber/actions/barber-actions";
import { useSettingsBarber } from "@/features/barber/settings/useSettingsBarber";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import FormTimesServices from "./form-times-services";

const daysMap = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

export function TableSettings({ barberId }: { barberId: string }) {
  const { settings } = useSettingsBarber(barberId);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Dia</TableHead>
          <TableHead>Início</TableHead>
          <TableHead>Fim</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="">
        {Array(settings ? settings.length : 0)
          .fill(0)
          .map((_, index) => (
            <TableRow key={index} className="w-full">
              <TableCell>{daysMap[settings?.[index].dayOfWeek ?? 0]}</TableCell>
              <TableCell>{`${format(new Date(settings?.[index].startTime ?? ""), "HH:mm")}`}</TableCell>
              <TableCell>{`${format(new Date(settings?.[index].endTime ?? ""), "HH:mm")}`}</TableCell>
              <TableCell className="flex gap-2">
                <FormTimesServices
                  barberId={barberId}
                  settings={settings?.[index]}
                />
                <Button
                  variant={"destructive"}
                  onClick={() =>
                    deleteDisponibility(
                      barberId,
                      settings?.[index].dayOfWeek ?? 0,
                    )
                  }
                >
                  <Trash2Icon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
