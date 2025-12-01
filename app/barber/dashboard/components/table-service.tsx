"use client";

import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/app/_components/ui/table";
import { convertBRL } from "@/utils/convertBRL";
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { deleteService } from "@/app/_actions/services/service-actions";
import { useServices } from "@/hooks/useServices";

export function TableService({ barberId }: { barberId: string }) {
  const { data: services, isLoading } = useServices(barberId);

  return (
    <>
      {/* Alterar depois pra um loader */}
      {isLoading && <p>Carregando serviços...</p>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="">
          {services?.map((service) => (
            <TableRow key={service.id} className="w-full">
              <TableCell>{service.name}</TableCell>
              <TableCell>{convertBRL(service.priceInCents)}</TableCell>
              <TableCell className="flex gap-2">
                <Button variant={"secondary"}>
                  <PencilIcon />
                </Button>
                <Button
                  variant={"destructive"}
                  onClick={() => deleteService({ serviceId: service.id })}
                >
                  <Trash2Icon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-1 justify-end">
        <Button variant={"default"}>
          <PlusIcon />
          Adicionar Serviço
        </Button>
      </div>
    </>
  );
}
