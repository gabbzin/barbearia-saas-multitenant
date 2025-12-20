import { prisma } from "@/lib/prisma";
import Header from "../_components/header";
import HeaderTitle from "../_components/me/HeaderTitle";
import SignatureItem from "../_components/signature/signature-item";
import { PageContainer, PageSection } from "../_components/ui/page";
import { Separator } from "../_components/ui/separator";

export default async function SignaturePage() {
  const plans = await prisma.plan.findMany({
    where: {
      NOT: {
        name: "FREE",
      },
    },
  });

  return (
    <>
      <Header />

      <Separator />

      <PageContainer>
        <HeaderTitle>Assinaturas</HeaderTitle>
        <PageSection>
          {plans.map(plan => {
            return <SignatureItem key={plan.id} plan={plan} />;
          })}
        </PageSection>
      </PageContainer>
    </>
  );
}
