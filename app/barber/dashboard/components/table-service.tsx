"use client";

import { Trash2Icon } from "lucide-react";
import { useServicesCRUD } from "@/features/service/hooks/useServices";
import { Button } from "@/shared/components/ui/button";
import { Spinner } from "@/shared/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { convertBRL } from "@/utils/convertBRL";
import { FormService } from "./form-service";

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
              {services?.map(service => (
                <TableRow key={service.id} className="w-full">
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{convertBRL(service.priceInCents)}</TableCell>
                  <TableCell className="flex gap-2">
                    <FormService barberId={barberId} service={service} />
                    <Button
                      variant={"destructive"}
                      onClick={() => deleteService(service.id)}
                    >
                      <Trash2Icon />
                    </Button>
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
