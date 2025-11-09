import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ServiceItem } from "@/app/_components/service-item";
import { Button } from "@/app/_components/ui/button";
import { Separator } from "@/app/_components/ui/separator";
import { ChevronLeft, Smartphone } from "lucide-react";
import Link from "next/link";
import { PhoneItem } from "@/app/_components/phone-item";
import Footer from "@/app/_components/footer";

const BarbershopPage = async (props: PageProps<"/barbershops/[id]">) => {
  const { id } = await props.params;

  const barbershop = await prisma.barbershop.findUnique({
    where: {
      id,
    },
    include: {
      services: true,
    },
  });

  if (!barbershop) {
    return notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header com Banner */}
      <div className="relative h-[297px] w-full">
        <Image
          src={barbershop.imageUrl}
          alt={barbershop.name}
          fill
          className="object-cover"
          priority
        />

        {/* Botão Voltar */}
        <div className="absolute top-6 left-5">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full"
            asChild
          >
            <Link href="/">
              <ChevronLeft className="size-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Container Principal */}
      <div className="bg-background relative -mt-6 flex flex-col gap-6 rounded-t-3xl">
        {/* Informações da Barbearia */}
        <div className="px-5 pt-6">
          <div className="mb-1 flex items-center gap-2">
            <div className="relative size-[30px] overflow-hidden rounded-full">
              <Image
                src={barbershop.imageUrl}
                alt={barbershop.name}
                fill
                className="object-cover"
              />
            </div>
            <h1 className="text-foreground text-xl font-bold">
              {barbershop.name}
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">{barbershop.address}</p>
        </div>

        <Separator />

        {/* Sobre Nós */}
        <div className="space-y-3 px-5">
          <h2 className="text-foreground text-xs font-bold uppercase">
            Sobre Nós
          </h2>
          <p className="text-foreground text-sm leading-relaxed">
            {barbershop.description}
          </p>
        </div>

        <Separator />

        {/* Serviços */}
        <div className="space-y-3 px-5">
          <h2 className="text-foreground text-xs font-bold uppercase">
            Serviços
          </h2>
          <div className="space-y-3">
            {barbershop.services.map((service) => (
              <ServiceItem key={service.id} service={service} />
            ))}
          </div>
        </div>

        <Separator />

        {/* Contato */}
        <div className="space-y-3 px-5">
          <h2 className="text-foreground text-xs font-bold uppercase">
            Contato
          </h2>
          <div className="space-y-3">
            {barbershop.phones.map((phone, index) => (
              <div
                key={index}
                className="flex flex-col w-full items-center justify-between"
              >
                <PhoneItem phone={phone} />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default BarbershopPage;
