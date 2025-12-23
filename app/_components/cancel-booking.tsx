"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import { cancelBooking } from "@/app/_actions/bookings/cancel-booking";
import CancelAlertDialog from "./cancel-alert-dialog";
import { PhoneItem } from "./phone-item";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";

interface CancelBookingProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: {
    id: string;
    date: Date;
    service: {
      name: string;
      priceInCents: number;
    };
    barber: {
      name: string;
      imageUrl: string;
      phone: string[];
    };
  };
  status: "confirmed" | "finished" | "cancelled";
}

export function CancelBooking({
  open,
  onOpenChange,
  booking,
  status,
}: CancelBookingProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { execute: executeCancelBooking } = useAction(cancelBooking, {
    onSuccess: () => {
      toast.success("Reserva cancelada com sucesso!");
      onOpenChange(false);
      router.refresh();
    },
    onError: () => {
      toast.error("Erro ao cancelar reserva.");
      setIsLoading(false);
    },
  });

  const handleCancelBooking = () => {
    setIsLoading(true);
    executeCancelBooking({ bookingId: booking.id });
  };

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(booking.service.priceInCents / 100);

  const formattedDate = booking.date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
  });

  const formattedTime = booking.date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[90%] max-w-[370px] overflow-y-auto p-0">
        <SheetHeader className="px-5 py-6 text-left">
          <SheetTitle>Informações da Reserva</SheetTitle>
          <SheetDescription className="sr-only">
            Detalhes da sua reserva
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-5 py-6">
          {/* Imagem do Mapa e Card da Barbearia */}
          <div className="relative h-[180px] w-full overflow-hidden rounded-lg">
            <Image
              src="/map.png"
              alt="Mapa"
              fill
              className="object-cover"
              quality={100}
            />
            <Card className="absolute bottom-5 left-1/2 flex w-[calc(100%-40px)] -translate-x-1/2 items-center gap-3 p-5">
              <Avatar className="size-12">
                <AvatarImage src={booking.barber.imageUrl} />
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <h3 className="truncate font-bold">{booking.barber.name}</h3>
              </div>
            </Card>
          </div>

          {/* Badge de Status */}
          <Badge
            variant={
              status === "confirmed"
                ? "default"
                : status === "cancelled"
                  ? "destructive"
                  : "secondary"
            }
            className="w-fit font-semibold text-xs uppercase tracking-tight"
          >
            {status === "confirmed"
              ? "Confirmado"
              : status === "cancelled"
                ? "Cancelado"
                : "Finalizado"}
          </Badge>

          {/* Card de Informações do Agendamento */}
          <Card className="flex flex-col gap-3 p-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">{booking.service.name}</h3>
              <p className="font-bold text-sm">{formattedPrice}</p>
            </div>
            <div className="flex items-center justify-between text-muted-foreground text-sm">
              <p>Data</p>
              <p className="text-right">{formattedDate}</p>
            </div>
            <div className="flex items-center justify-between text-muted-foreground text-sm">
              <p>Horário</p>
              <p className="text-right">{formattedTime}</p>
            </div>
            <div className="flex items-center justify-between text-muted-foreground text-sm">
              <p>Barbearia</p>
              <p className="text-right">{booking.barber.name}</p>
            </div>
          </Card>

          {/* Telefones */}
          <div className="flex flex-col gap-3">
            {booking.barber.phone.map((phone, index) => (
              <PhoneItem key={String(index)} phone={phone} />
            ))}
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-3 px-5 py-6">
          <Button
            variant="outline"
            className="flex-1 rounded-full"
            onClick={() => onOpenChange(false)}
          >
            Voltar
          </Button>
          {status === "confirmed" && booking.date > new Date() && (
            <CancelAlertDialog
              handleCancel={handleCancelBooking}
              isLoading={isLoading}
              title="Cancelar Reserva"
              description="Tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita."
              cancelButtonText="Não, manter reserva"
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
