import { prisma } from "@/lib/prisma";
import { getCurrentSubscription } from "@/services/user.service";
import Header from "../_components/header";
import HeaderTitle from "../_components/me/HeaderTitle";
import SignatureItem from "../_components/signature/signature-item";
import { Carousel, CarouselContent } from "../_components/ui/carousel";
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

  const myPlan = await getCurrentSubscription();

  return (
    <>
      <Header />

      <Separator />

      <PageContainer>
        <HeaderTitle>Assinaturas</HeaderTitle>
        <PageSection>
          <div className="p-2">
            <Carousel className="w-full">
              <CarouselContent>
                {plans.map(plan => {
                  return (
                    <SignatureItem
                      key={plan.id}
                      plan={plan}
                      myPlanName={myPlan.name}
                    />
                  );
                })}
              </CarouselContent>
            </Carousel>
          </div>
        </PageSection>
      </PageContainer>
    </>
  );
}
