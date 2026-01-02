/** biome-ignore-all lint/suspicious/noArrayIndexKey: <Tá> */
"use client";

import { useSettingsBarber } from "@/features/barber/settings/useSettingsBarber";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

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
          <TableHead>Dia da semana</TableHead>
          <TableHead>Início</TableHead>
          <TableHead>Fim</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="">
        {Array(settings ? settings.daysOfWeek.length : 0)
          .fill(0)
          .map((_, index) => (
            <TableRow key={index}>
              <TableCell>{daysMap[settings?.daysOfWeek[index] ?? 0]}</TableCell>
              <TableCell>{settings?.startTime}</TableCell>
              <TableCell>{settings?.endTime}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
