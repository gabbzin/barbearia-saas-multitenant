import CardInfo from "@/app/_components/barber/card-info";
import Header from "@/app/_components/header";
import { Avatar } from "@/app/_components/ui/avatar";
import { Card, CardContent } from "@/app/_components/ui/card";
import { PageContainer } from "@/app/_components/ui/page";
import { Separator } from "@/app/_components/ui/separator";
import { auth } from "@/lib/auth";
import { convertBRL } from "@/utils/convertBRL";
import { Banknote, Scissors, UserIcon } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import { TableService } from "./components/table-service";
import { prisma } from "@/lib/prisma";

const barberId = "c26c52ae-dc7d-4523-8607-6e4ff66d5568";

const BarberDashboardPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const faturamento = convertBRL(12500);

  const fat = await prisma.booking.aggregate({
    where: {
      barberId: barberId,
      status: "COMPLETED",
    },
  });

  // Adicionar a verificação de tipo de usuário depois
  // (session.user.role !== "BARBER")
  // if (!session?.user) {
  //   notFound();
  // }

  return (
    <div>
      <Header />
      <PageContainer>
        <h2 className="text-2xl font-bold lg:text-3xl">
          Olá {session?.user.name ?? "Usuario"}
        </h2>
        <h3 className="text-lg font-bold lg:text-2xl">Resumo de hoje</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <CardInfo
            Icon={Scissors}
            title="Atendimentos realizados"
            value={10}
            variant="blue"
          />
          <CardInfo
            Icon={UserIcon}
            title="Atendimentos agendados"
            value={5}
            variant="red"
          />
          <CardInfo
            Icon={Banknote}
            title="Faturamento"
            value={faturamento}
            variant="green"
          />
        </div>
      </PageContainer>
      <Separator />
      <PageContainer>
        <h3 className="text-lg font-bold lg:text-2xl">Próximo atendimento</h3>
        <Card className="border-primary border-2">
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center gap-4 font-semibold">
              <Avatar>
                <Image
                  src={session?.user.image ?? ""}
                  alt={session?.user.name ?? ""}
                  fill
                  className="object-cover"
                  priority
                />
              </Avatar>
              <p>{session?.user.name}</p>
            </div>
            <div className="space-y-1">
              <p>
                <span className="font-bold">Serviço: </span>
                Corte de cabelo
              </p>
              <p>
                <span className="font-bold">Horário: </span>
                14:30
              </p>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
      <Separator />
      <PageContainer>
        <h3 className="text-lg font-bold lg:text-2xl">
          Seus serviços cadastrados
        </h3>
        <TableService barberId={barberId} />
      </PageContainer>
    </div>
  );
};

export default BarberDashboardPage;
