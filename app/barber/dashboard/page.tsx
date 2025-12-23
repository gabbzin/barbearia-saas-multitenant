import { AlertCircle, Banknote, Scissors, UserIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import CardInfo from "@/app/_components/barber/card-info";
import Header from "@/app/_components/header";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import { PageContainer } from
"@/ap@/app/_components/ui/shadcnui/card

import { Alert, AlertTitle } from "@/app/_components/ui/alert";
import { Avatar, AvatarImage } from "@/app/_components/ui/avatar";
import { Separator } from "@/app/_components/ui/separator";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/services/user.service";
import { convertBRL } from "@/utils/convertBRL";
import FormTimesServices from "./components/form-times-services";
import { TableService } from "./components/table-service";

const BarberDashboardPage = async () => {
  const session = await verifySession();

  if (session?.role !== "BARBER") {
    notFound();
  }

  const barberId = session.id;

  const today = new Date();

  const startOfDayDate = new Date(today);
  startOfDayDate.setUTCHours(0, 0, 0, 0);

  const endOfDayDate = new Date(today);
  endOfDayDate.setUTCHours(23, 59, 59, 999);

  const requests = Promise.allSettled([
    // Próximo agendamento
    prisma.booking.findFirst({
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
    }),

    // Faturamento e atendimentos realizados hoje
    prisma.booking.aggregate({
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
    }),

    // Agendamentos para hoje
    prisma.booking.count({
      where: {
        barberId: barberId,
        date: {
          gte: startOfDayDate,
        },
        status: "SCHEDULED",
      },
    }),

    // Verifica se o barbeiro tem horários padrão configurados
    prisma.disponibilityDefault.findFirst({
      where: {
        barberId: barberId,
      },
    }),
  ]);

  const [nextBookingResult, faturamentoResult, bookingsResult, horariosResult] =
    await requests;

  const nextBooking =
    nextBookingResult.status === "fulfilled" ? nextBookingResult.value : null;

  const faturamento =
    faturamentoResult.status === "fulfilled"
      ? faturamentoResult.value
      : { _sum: { priceInCents: 0 }, _count: { id: 0 } };

  const atendimentos =
    bookingsResult.status === "fulfilled" ? bookingsResult.value : 0;

  const horarios =
    horariosResult.status === "fulfilled" ? horariosResult.value : false;

  const faturamentoHoje = convertBRL(faturamento._sum.priceInCents ?? 0);
  const atendimentosRealizados = faturamento._count.id ?? 0;

  return (
    <div>
      <Header />
      <Alert>
        <AlertTitle>
          <AlertCircle />
          {horarios
            ? " Seus horários padrão estão configurados."
            : " Você ainda não configurou seus horários padrão. Por favor, configure-os nas configurações abaixo."}
        </AlertTitle>
      </Alert>
      <PageContainer>
        <h2 className="font-bold text-2xl lg:text-3xl">
          Olá {session.name ?? "Usuario"}
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
      <PageContainer>
        <h3 className="font-bold text-lg lg:text-2xl">Configurações</h3>
        <FormTimesServices />
      </PageContainer>
    </div>
  );
};

export default BarberDashboardPage;
