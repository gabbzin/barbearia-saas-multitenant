"use client";
import type { Plan } from "@prisma/client";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { createSignature } from "@/app/_actions/signatures/create-signature";
import { convertBRL } from "@/utils/convertBRL";
import { convertCapitalize } from "@/utils/convertCapitalize";
import { AuroraText } from "../ui/aurora-text";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { CarouselItem } from "../ui/carousel";
import { Separator } from "../ui/separator";
import { ShimmerButton } from "../ui/shimmer-button";

type SignatureItemProps = {
  plan: Plan;
  myPlanName?: string | null;
};

const SignatureItem = ({ plan, myPlanName }: SignatureItemProps) => {
  const { executeAsync, isPending } = useAction(createSignature);

  const priceInReais = convertBRL(plan.priceInCents);

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
    <CarouselItem>
      {myPlanName?.toLowerCase() === plan.name.toLowerCase() ? (
        <div className="absolute m-auto max-w-64 rounded bg-foreground px-2 py-1 font-semibold text-background">
          Plano atual
        </div>
      ) : (
        ""
      )}
      <Card className="z-10 border-2 shadow-lg dark:border-white">
        <CardHeader className="">
          <CardTitle className="text-center font-bold text-3xl">
            <AuroraText className="font-geist">
              {convertCapitalize(plan.name)}
            </AuroraText>
            <CardDescription>
              <p className="whitespace-pre font-bold text-card-foreground text-md leading-[1.4]">
                <span className="text-2xl text-green-500">{priceInReais}</span>
                /mês
              </p>
            </CardDescription>
          </CardTitle>
        </CardHeader>

        <Separator className="my-6 dark:bg-white" />

        <CardContent className="mt-2">
          <h3 className="font-bold text-lg">Beneficios </h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
            <li>1º Beneficio</li>
            <li>2º Beneficio</li>
            <li>3º Beneficio</li>
            <li>4º Beneficio</li>
            <li>5º Beneficio</li>
          </ul>
        </CardContent>

        <Separator className="my-6 dark:bg-white" />

        <CardFooter className="mt-2 flex items-end justify-between">
          <Button className="w-full" asChild>
            <ShimmerButton
              onClick={handleConfirm}
              disabled={isPending}
              className="dark:bg-white dark:text-white"
            >
              Assine aqui
            </ShimmerButton>
          </Button>
        </CardFooter>
      </Card>
    </CarouselItem>
  );
};

export default SignatureItem;
