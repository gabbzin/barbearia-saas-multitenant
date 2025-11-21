import { prisma } from "@/lib/prisma";
import Header from "../_components/header";
import HeaderTitle from "../_components/me/HeaderTitle";
import SignatureItem from "../_components/signature/signature-item";
import { PageContainer, PageSection } from "../_components/ui/page";
import { Separator } from "../_components/ui/separator";

export default async function SignaturePage() {
  const signatures = await prisma.subscription.findMany();

  return (
    <>
      <Header />

      <Separator />

      <PageContainer>
        <HeaderTitle>Assinatura</HeaderTitle>
        <PageSection>
          {signatures.map((signature) => {
            return <SignatureItem key={signature.id} signature={signature} />;
          })}
        </PageSection>
      </PageContainer>
    </>
  );
}
