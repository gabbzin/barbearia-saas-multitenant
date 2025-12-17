import Header from "./_components/header";
import { prisma } from "@/lib/prisma";
import {
  PageContainer,
  PageSection,
  PageSectionScroller,
  PageSectionTitle,
} from "./_components/ui/page";
import Footer from "./_components/footer";
import { Alert, AlertTitle } from "./_components/ui/alert";
import { CheckCircleIcon, TriangleAlertIcon } from "lucide-react";
import BarberItem from "./_components/barber-item";
import { verifySession } from "@/utils/verifySession";

const Home = async () => {
  const user = await verifySession();
  // const user = session?.user.id

  const recommendedBarbershops = await prisma.barber.findMany({
    include: {
      user: true,
    },
  });

  const popularBarbershops = await prisma.barber.findMany({
    include: {
      user: true,
    },
  });

  // Ordenar no JavaScript após buscar os dados
  recommendedBarbershops.sort((a, b) => {
    const nameA = a.user?.name ?? "";
    const nameB = b.user?.name ?? "";
    return nameA.localeCompare(nameB);
  });

  popularBarbershops.sort((a, b) => {
    const nameA = a.user?.name ?? "";
    const nameB = b.user?.name ?? "";
    return nameB.localeCompare(nameA);
  });

  return (
    <main>
      <Header />
      <div className="mx-auto px-12">
        <Alert variant={user ? "success" : "warn"} className="mb-2">
          <AlertTitle className="flex items-center gap-4">
            {user?.name ? (
              <>
                <CheckCircleIcon />
                <p>Logado com sucesso: Olá, + {user.name}!</p>
              </>
            ) : (
              <>
                <TriangleAlertIcon />
                <p>Login não realizado ainda</p>
              </>
            )}
          </AlertTitle>
        </Alert>
        {/* <Alert
          variant={user?.status === "ACTIVE" ? "success" : "destructive"}
          className="mb-2"
        >
          <AlertTitle className="flex items-center gap-4">
            {user && user.status === "ACTIVE" ? (
              <>
                <CheckCircleIcon />
                <p>Você é assinante do plano {user.plan.name}</p>
              </>
            ) : (
              <>
                <TriangleAlertIcon />
                <p>Ainda não é assinante</p>
              </>
            )}
          </AlertTitle>
        </Alert> */}
        <Alert variant={"warn"} className="mb-2">
          <AlertTitle className="flex items-center gap-4">
            <TriangleAlertIcon />
            <p>
              O sistema está em fase alpha, para realizar agendamentos é
              necessário estar logado.
            </p>
          </AlertTitle>
        </Alert>
      </div>
      <PageContainer>
        {/* <SearchInput /> */}
        {/* <Image
          src={banner} // Fazemos isso para otimizar a imagem e evitar problemas de Cumulative Layout Shift (CLS)
          alt="Banner"
          sizes="100vw"
          className="h-auto w-full"
        /> */}

        <PageSection>
          <PageSectionTitle>Agendamentos</PageSectionTitle>
        </PageSection>

        <PageSection>
          <PageSectionTitle>Barbeiros</PageSectionTitle>
          <PageSectionScroller>
            {recommendedBarbershops.map((barber) => (
              <BarberItem
                key={barber.id}
                barber={{
                  id: barber.id,
                  name: barber.user?.name ?? "Barbeiro",
                  imageUrl: barber.imageUrl,
                }}
              />
            ))}
          </PageSectionScroller>
        </PageSection>

        <PageSection>
          <PageSectionTitle>Recomendados</PageSectionTitle>
          <PageSectionScroller>
            {popularBarbershops.map((barber) => (
              <BarberItem
                key={barber.id}
                barber={{
                  id: barber.id,
                  name: barber.user?.name ?? "Barbeiro",
                  imageUrl: barber.imageUrl,
                }}
              />
            ))}
          </PageSectionScroller>
        </PageSection>
      </PageContainer>
      <Footer />
    </main>
  );
};

export default Home;
