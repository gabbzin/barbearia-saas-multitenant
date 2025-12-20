import { Banknote, Scissors, UserIcon } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import CardInfo from "@/app/_components/barber/card-info";
import Header from "@/app/_components/header";
import { Avatar, AvatarImage } from "@/app/_components/ui/avatar";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import { PageContainer } from "@/app/_components/ui/page";
import { Separator } from "@/app/_components/ui/separator";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { convertBRL } from "@/utils/convertBRL";
import { TableService } from "./components/table-service";

const barberId = "f33dbcbb-eda1-4cac-afe5-91aea909bd37";

const BarberDashboardPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session?.user.role !== "BARBER") {
    notFound();
  }

  const today = new Date();

  const startOfDayDate = new Date(today);
  startOfDayDate.setUTCHours(0, 0, 0, 0);

  const endOfDayDate = new Date(today);
  endOfDayDate.setUTCHours(23, 59, 59, 999);

  const nextBooking = await prisma.booking.findFirst({
    where: {
      barberId: barberId,
      date: {
        gte: startOfDayDate,
      },
      status: "SCHEDULED",
    },
    include: {
      service: true,
      user: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  const faturamento = await prisma.booking.aggregate({
    _sum: {
      priceInCents: true,
    },
    _count: {
      id: true,
    },
    where: {
      barberId: barberId,
      date: {
        gte: startOfDayDate,
        lte: endOfDayDate,
      },
      status: "COMPLETED",
    },
  });

  const atendimentos = await prisma.booking.count({
    where: {
      barberId: barberId,
      date: {
        gte: startOfDayDate,
      },
      status: "SCHEDULED",
    },
  });

  const faturamentoHoje = convertBRL(faturamento._sum.priceInCents ?? 0);
  const atendimentosRealizados = faturamento._count.id;

  return (
    <div>
      <Header />
      <PageContainer>
        <h2 className="font-bold text-2xl lg:text-3xl">
          Olá {session?.user.name ?? "Usuario"}
        </h2>
        <h3 className="font-bold text-lg lg:text-2xl">Resumo de hoje</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <CardInfo
            Icon={Scissors}
            title="Atendimentos realizados"
            value={atendimentosRealizados}
            variant="blue"
          />
          <CardInfo
            Icon={UserIcon}
            title="Atendimentos agendados"
            value={atendimentos}
            variant="red"
          />
          <CardInfo
            Icon={Banknote}
            title="Faturamento"
            value={faturamentoHoje}
            variant="green"
          />
        </div>
      </PageContainer>
      <Separator />
      <PageContainer>
        <h3 className="font-bold text-lg lg:text-2xl">Próximo atendimento</h3>
        <Card className="border-2 border-primary">
          <CardContent className="flex flex-col gap-3">
            {nextBooking ? (
              <>
                <div className="flex items-center gap-4 font-semibold">
                  <Avatar>
                    <AvatarImage
                      src={"https://github.com/shadcn.png"}
                      alt={nextBooking.user.name ?? "User Avatar"}
                      className="object-cover"
                    />
                  </Avatar>
                  <p>{nextBooking.user.name}</p>
                </div>
                <div className="space-y-1">
                  <p>
                    <span className="font-bold">Serviço: </span>
                    {nextBooking.service.name}
                  </p>
                  <p>
                    <span className="font-bold">Horário: </span>
                    {nextBooking.date.toTimeString().substring(0, 5)}
                  </p>
                </div>
              </>
            ) : (
              <p>Nenhum agendamento encontrado</p>
            )}

            <Button variant={"outline"} asChild>
              <Link href="/barber/schedule">Ver agenda completa</Link>
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
      <Separator />
      <PageContainer>
        <h3 className="font-bold text-lg lg:text-2xl">
          Seus serviços cadastrados
        </h3>
        <TableService barberId={barberId} />
      </PageContainer>
    </div>
  );
};

export default BarberDashboardPage;
