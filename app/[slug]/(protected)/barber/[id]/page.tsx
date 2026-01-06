import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/funcs/get-db";
import Footer from "@/shared/components/footer";
import { PhoneItem } from "@/shared/components/phone-item";
import { ServiceItem } from "@/shared/components/service-item";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";

const BarberPage = async (props: PageProps<"/[slug]/barber/[id]">) => {
  const { id } = await props.params;

  const barber = await db.barber.findUnique({
    where: {
      id,
    },
    include: {
      services: true,
      user: true,
    },
  });

  if (!barber || !barber.user) {
    return notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header com Banner */}
      <div className="relative h-[297px] w-full">
        <Image
          src={barber.user.image ?? ""}
          alt={barber.user.name ?? ""}
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
      <div className="relative -mt-6 flex flex-col gap-6 rounded-t-3xl bg-background">
        {/* Informações da Barbearia */}
        <div className="px-5 pt-6">
          <div className="mb-1 flex items-center gap-2">
            <div className="relative size-[30px] overflow-hidden rounded-full">
              <Image
                src={barber.user.image ?? ""}
                alt={barber.user.name ?? ""}
                fill
                className="object-cover"
              />
            </div>
            <h1 className="font-bold text-foreground text-xl">
              {barber.user.name}
            </h1>
          </div>
          {/* <p className="text-muted-foreground text-sm">{barber.address}</p> */}
        </div>

        <Separator />

        {/* Sobre Nós */}
        <div className="space-y-3 px-5">
          <h2 className="font-bold text-foreground text-xs uppercase">Sobre</h2>
          <p className="text-foreground text-sm leading-relaxed">
            Bio do barbeiro
          </p>
        </div>

        <Separator />

        {/* Serviços */}
        <div className="space-y-3 px-5">
          <h2 className="font-bold text-foreground text-xs uppercase">
            Serviços
          </h2>
          <div className="space-y-3">
            {barber.services.map(service => (
              <ServiceItem
                key={service.id}
                service={{
                  ...service,
                  barber: { ...barber, user: barber.user },
                }}
              />
            ))}
          </div>
        </div>

        <Separator />

        {/* Contato */}
        <div className="space-y-3 px-5">
          <h2 className="font-bold text-foreground text-xs uppercase">
            Contato
          </h2>
          <div className="space-y-3">
            <PhoneItem phone={barber.phone} />
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default BarberPage;
