import Header from "@/app/_components/header";
import { PageContainer } from "@/app/_components/ui/page";
import { ScheduleCard } from "./components/schedule-card";

export default function BarberSchedulePage() {
  return (
    <div>
      <Header />
      <main>
        <PageContainer>
          <h1 className="mb-4 text-xl font-bold">Agenda Completa</h1>
          <ScheduleCard barberId={"f33dbcbb-eda1-4cac-afe5-91aea909bd37"} />
        </PageContainer>
      </main>
    </div>
  );
}
