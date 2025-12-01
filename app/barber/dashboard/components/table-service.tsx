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
import { Trash2Icon } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { useServicesCRUD } from "@/hooks/useServices";
import { FormService } from "./form-service";
import { Spinner } from "@/app/_components/ui/spinner";

export function TableService({ barberId }: { barberId: string }) {
  const { services, isLoading, deleteService } = useServicesCRUD(barberId);

  return (
    <>
      {/* Alterar depois pra um loader */}
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Spinner className="size-8" />
        </div>
      ) : (
        <>
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
                    <>
                      <FormService barberId={barberId} service={service} />
                      <Button
                        variant={"destructive"}
                        onClick={() => deleteService(service.id)}
                      >
                        <Trash2Icon />
                      </Button>
                    </>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex flex-1 justify-end">
            <FormService barberId={barberId} />
          </div>
        </>
      )}
    </>
  );
}
