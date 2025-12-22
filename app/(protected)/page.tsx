import { format } from "date-fns";
import { CheckCircleIcon, TriangleAlertIcon } from "lucide-react";
import { getBarbers } from "@/services/barbers.service";
import { verifySession } from "@/services/user.service";
import { getCurrentSubscriptionAction } from "../_actions/signatures/get-current-subscription";
import BarberItem from "../_components/barber-item";
import Footer from "../_components/footer";
import Header from "../_components/header";
import { Alert, AlertTitle } from "../_components/ui/alert";
import {
  PageContainer,
  PageSection,
  PageSectionScroller,
  PageSectionTitle,
} from "../_components/ui/page";

const Home = async () => {
  const user = await verifySession();

  const barbers = await getBarbers();
  const plan = await getCurrentSubscriptionAction();

  // Ordenar no JavaScript após buscar os dados
  barbers.sort((a, b) => {
    const nameA = a.user?.name ?? "";
    const nameB = b.user?.name ?? "";
    return nameA.localeCompare(nameB);
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
                <p>Logado com sucesso: Olá, {user.name}!</p>
              </>
            ) : (
              <>
                <TriangleAlertIcon />
                <p>Login não realizado ainda</p>
              </>
            )}
          </AlertTitle>
        </Alert>
        <Alert
          variant={plan.hasPlan ? "success" : "destructive"}
          className="mb-2"
        >
          <AlertTitle className="flex items-center gap-4">
            {plan.hasPlan ? (
              <>
                <CheckCircleIcon />
                <p>
                  Você está incluso no plano: {plan.name}
                  <br />
                  Válido até{" "}
                  {format(
                    new Date(plan.validUntil ? plan.validUntil : ""),
                    "dd/MM/yyyy",
                  )}
                </p>
              </>
            ) : (
              <>
                <TriangleAlertIcon />
                <p>Ainda não é assinante</p>
              </>
            )}
          </AlertTitle>
        </Alert>
        <Alert variant={"warn"} className="mb-2">
          <AlertTitle className="flex items-center gap-4">
            <TriangleAlertIcon />
            <p>
              O sistema está em fase beta, para realizar agendamentos é
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
            {barbers.map(barber => (
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
