"use client";

import Image from "next/image";
import { Button } from "./ui/button";

interface ServiceItemProps {
  service: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    priceInCents: number;
  };
}

export const ServiceItem = ({ service }: ServiceItemProps) => {
  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="border-border bg-card flex w-full items-center gap-3 rounded-2xl border p-3">
      <div className="relative size-[110px] shrink-0">
        <Image
          src={service.imageUrl}
          alt={service.name}
          fill
          className="rounded-lg object-cover"
        />
      </div>

      <div className="flex min-h-[110px] flex-1 flex-col justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-card-foreground text-sm font-bold">
            {service.name}
          </h3>
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {service.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-card-foreground text-sm font-bold">
            {formatPrice(service.priceInCents)}
          </p>
          <Button size="sm" className="rounded-full px-4 py-2">
            Reservar
          </Button>
        </div>
      </div>
    </div>
  );
};
