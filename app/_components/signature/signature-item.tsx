"use client";
import type { Plan } from "@prisma/client";
import Image from "next/image";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { createSignature } from "@/app/_actions/signatures/create-signature";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

type SignatureItemProps = {
  plan: Plan;
};

const SignatureItem = ({ plan }: SignatureItemProps) => {
  const { executeAsync, isPending } = useAction(createSignature);

  const priceInReais = (plan.priceInCents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const handleConfirm = async () => {
    const data = {
      planId: plan.id,
    };

    const result = await executeAsync(data);

    if (result.serverError || result.validationErrors) {
      toast.error(result.validationErrors?._errors?.[0]);
      return;
    }

    if (result.data && "url" in result.data) {
      if (result.data.url) {
        window.location.href = result.data.url;
        return;
      }
    }
    toast.success("Assinatura realizada com sucesso!");
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border border-solid bg-card p-3">
      <div className="flex items-center justify-center gap-3">
        <div className="relative size-[110px] shrink-0 overflow-hidden rounded-[10px]">
          <Image
            src={
              "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png"
            }
            alt={"Assinatura 1"}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex grow basis-0 flex-row items-center self-stretch">
          <div className="relative flex h-full min-h-0 min-w-0 grow basis-0 flex-col items-start justify-between">
            <div className="flex w-full flex-col items-start gap-1 text-sm leading-[1.4]">
              <p className="w-full font-bold text-card-foreground">
                {plan.name}
              </p>
              <p className="w-full font-normal text-muted-foreground">
                {plan.description}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <p className="whitespace-pre font-bold text-card-foreground text-md leading-[1.4]">
          <Badge variant="outline" className="m-0 bg-green-600 p-2 text-white">
            {priceInReais}
          </Badge>
        </p>
        <Button
          className="rounded-full px-4 py-2"
          onClick={handleConfirm}
          disabled={isPending}
        >
          Assinar
        </Button>
      </div>
    </div>
  );
};

export default SignatureItem;
