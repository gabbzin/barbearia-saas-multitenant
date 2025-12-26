"use client";

import type { Prisma } from "@prisma/client";
import { type CalendarOptions, ICalendar } from "datebook";
import {
  CalendarFoldIcon,
  ClockIcon,
  EllipsisIcon,
  ScissorsIcon,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import wrapper from "../functions/download-ics";

interface NextBookingProps {
  nextBooking: Prisma.BookingGetPayload<{
    include: {
      service: {
        include: {
          barber: {
            include: {
              user: true;
            };
          };
        };
      };
    };
  }> | null;
}

export function NextBooking({ nextBooking }: NextBookingProps) {
  const start = new Date();

  // Atualizar para usar dados reais do nextBooking
  const eventConfig: CalendarOptions = {
    title: "Agendamento de Serviço",
    start: start,
    end: start,
    description: "Detalhes do agendamento",
    location: "Local do Serviço",
  };

  const handleButtonClick = () => {
    const iCalendar = new ICalendar(eventConfig);
    wrapper(iCalendar);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nome do Serviço</CardTitle>
      </CardHeader>

      <CardContent>
        <Separator className="my-2" />
        <main className="flex items-center gap-3 py-2 font-geist">
          {/* Data e Hora */}
          <div className="flex h-full flex-col items-start border-r pr-4">
            <p className="text-center font-semibold text-xl capitalize leading-none">
              <span className="font-bold">26</span>
              <br />
              <span>DEZ</span>
            </p>
          </div>

          {/* Detalhes do Agendamento */}
          <div>
            <div className="flex items-center gap-2">
              <ScissorsIcon size={12} />
              <p>Nome do Barbeiro</p>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon size={12} />
              <p>Horário</p>
            </div>
          </div>

          {/* Tempo para conclusão */}
          <div></div>
        </main>
        <Separator className="my-2" />
      </CardContent>

      <CardFooter className="flex justify-between gap-2 *:text-xs">
        <Button className="" variant={"secondary"} onClick={handleButtonClick}>
          <CalendarFoldIcon />
          Adicionar
        </Button>
        <Button className="">
          <EllipsisIcon />
          Ver detalhes
        </Button>
      </CardFooter>
    </Card>
  );
}
