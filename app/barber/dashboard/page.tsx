import { AlertCircle, Banknote, Scissors, UserIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { verifySession } from "@/features/user/repository/user.repository";
import CardInfo from "@/shared/components/barber/card-info";
import Header from "@/shared/components/header";
import { Alert, AlertTitle } from "@/shared/components/ui/alert";
import { Avatar, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { PageContainer } from "@/shared/components/ui/page";
import { Separator } from "@/shared/components/ui/separator";
import { getBarberDashboardInfos } from "./actions/getInfos";
import FormTimesServices from "./components/form-times-services";
import { TableService } from "./components/table-service";

const BarberDashboardPage = async () => {
  const session = await verifySession();

  if (session?.role !== "BARBER") {
    notFound();
  }

  const barberId = session.id;

  const info = await getBarberDashboardInfos({ barberId });

  return (
    <div>
      <Header />
      <Alert>
        <AlertTitle className="flex items-center gap-2">
          <AlertCircle />
          {/* {horarios
            ? " Seus horários padrão estão configurados."
            : " Você ainda não configurou seus horários padrão. Por favor, configure-os nas configurações abaixo."} */}
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
            value={info.data?.servicesPerformed}
            variant="blue"
          />
          <CardInfo
            Icon={UserIcon}
            title="Atendimentos agendados"
            value={info.data?.totalSchedules}
            variant="red"
          />
          <CardInfo
            Icon={Banknote}
            title="Faturamento"
            value={info.data?.todayBilling}
            variant="green"
          />
        </div>
      </PageContainer>
      <Separator />
      <PageContainer>
        <h3 className="font-bold text-lg lg:text-2xl">Próximo atendimento</h3>
        <Card className="border-2 border-primary">
          <CardContent className="flex flex-col gap-3">
            {info.data?.nextBooking ? (
              <>
                <div className="flex items-center gap-4 font-semibold">
                  <Avatar>
                    <AvatarImage
                      src={"https://github.com/shadcn.png"}
                      alt={info.data?.nextBooking.user.name ?? "User Avatar"}
                      className="object-cover"
                    />
                  </Avatar>
                  <p>{info.data?.nextBooking.user.name}</p>
                </div>
                <div className="space-y-1">
                  <p>
                    <span className="font-bold">Serviço: </span>
                    {info.data?.nextBooking.service.name}
                  </p>
                  <p>
                    <span className="font-bold">Horário: </span>
                    {info.data?.nextBooking.date.toTimeString().substring(0, 5)}
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
        <FormTimesServices barberId={barberId} />
      </PageContainer>
    </div>
  );
};

export default BarberDashboardPage;
