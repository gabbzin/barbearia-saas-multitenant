import type { BarberService } from "@prisma/client";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import GenericForm from "@/app/_components/form/generic-form";
import InputForm from "@/app/_components/form/input-form";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { useServicesCRUD } from "@/hooks/useServices";
import { serviceSchema, type serviceSchemaType } from "@/schemas/serviceSchema";

interface FormServiceProps {
  barberId: string;
  service?: BarberService;
}

export function FormService({ barberId, service }: FormServiceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { createMutation, updateMutation } = useServicesCRUD(barberId);

  const isEditing = !!service;

  const defaultValues: serviceSchemaType | undefined = service
    ? {
        name: service.name,
        price: Number(service.priceInCents) / 100,
        description: service.description,
      }
    : undefined;

  const handleSubmit = (data: serviceSchemaType) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", String(data.price));
    formData.append("description", data.description);
    formData.append("imageUrl", data.imageUrl ?? "");

    if (isEditing && service) {
      updateMutation.mutate(
        { serviceId: service.id, data: formData },
        { onSuccess: () => setIsOpen(false) },
      );
    } else {
      formData.append("barberId", barberId);
      createMutation.mutate(formData, { onSuccess: () => setIsOpen(false) });
    }
  };

  const isLoading = isEditing
    ? updateMutation.isPending
    : createMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button variant={"secondary"} disabled={isLoading}>
            <PencilIcon />
          </Button>
        ) : (
          <Button disabled={isLoading}>
            <PlusIcon />
            Adicionar Serviço
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold text-xl">
            {isEditing ? "Editar Serviço" : "Adicionar Serviço"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            {isEditing
              ? "Altere os detalhes do serviço abaixo."
              : "Preencha os detalhes do novo serviço."}
          </DialogDescription>
        </DialogHeader>
        <GenericForm
          schema={serviceSchema}
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          submitText={isEditing ? "Salvar Alterações" : "Criar Serviço"}
          disabled={isLoading}
        >
          <InputForm
            name="name"
            label="Nome do Serviço"
            placeholder="Digite o nome do serviço"
          />
          <InputForm
            name="price"
            label="Preço do Serviço"
            placeholder="Digite o preço do serviço"
            mask="currency"
          />
          <InputForm
            name="description"
            label="Descrição do Serviço"
            placeholder="Digite a descrição do serviço"
          />
        </GenericForm>
      </DialogContent>
    </Dialog>
  );
}
