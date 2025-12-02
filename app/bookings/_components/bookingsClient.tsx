import BookingItem from "@/app/_components/booking-item";
import { PageContainer, PageSection } from "@/app/_components/ui/page";
import { Barber, BarberService, Booking, User } from "@prisma/client";

interface BookingsClientProps {
  bookings: (Booking & {
    service: BarberService & {
      barber: Barber & {
        user: User | null;
      };
    };
  })[];
}

export default function BookingsClient({ bookings }: BookingsClientProps) {
  const now = new Date();

  const confirmedBookings = bookings.filter(
    (booking) => booking.date > now && booking.status === "SCHEDULED",
  );

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "CANCELLED",
  );

  const finishedBookings = bookings.filter(
    (booking) => booking.date <= now && booking.status !== "CANCELLED",
  );
  return (
    <PageContainer>
      <h1 className="text-xl font-bold">Agendamentos</h1>
      <PageSection>
        <h2 className="text-muted-foreground text-xs font-bold uppercase">
          Confirmados
        </h2>
        {confirmedBookings.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Você não tem agendamentos confirmados.
          </p>
        ) : (
          confirmedBookings.map((booking) => (
            <BookingItem
              key={booking.id}
              booking={{
                id: booking.id,
                date: booking.date,
                service: {
                  name: booking.service.name,
                  priceInCents: booking.service.priceInCents,
                },
                barber: {
                  name: booking.service.barber.user?.name ?? "Barbeiro",
                  imageUrl: booking.service.barber.imageUrl,
                  phone: booking.service.barber.phone,
                },
              }}
              status="confirmed"
            />
          ))
        )}
      </PageSection>
      <PageSection>
        <h2 className="text-muted-foreground text-xs font-bold uppercase">
          Cancelados
        </h2>
        {cancelledBookings.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Você não tem agendamentos cancelados.
          </p>
        ) : (
          cancelledBookings.map((booking) => (
            <BookingItem
              key={booking.id}
              booking={{
                id: booking.id,
                date: booking.date,
                service: {
                  name: booking.service.name,
                  priceInCents: booking.service.priceInCents,
                },
                barber: {
                  name: booking.service.barber.user?.name ?? "Barbeiro",
                  imageUrl: booking.service.barber.imageUrl,
                  phone: booking.service.barber.phone,
                },
              }}
              status="cancelled"
            />
          ))
        )}
      </PageSection>
      <PageSection>
        <h2 className="text-muted-foreground text-xs font-bold uppercase">
          Finalizados
        </h2>
        {finishedBookings.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Você não tem agendamentos finalizados.
          </p>
        ) : (
          finishedBookings.map((booking) => (
            <BookingItem
              key={booking.id}
              booking={{
                id: booking.id,
                date: booking.date,
                service: {
                  name: booking.service.name,
                  priceInCents: booking.service.priceInCents,
                },
                barber: {
                  name: booking.service.barber.user?.name ?? "Barbeiro",
                  imageUrl: booking.service.barber.imageUrl,
                  phone: booking.service.barber.phone,
                },
              }}
              status="finished"
            />
          ))
        )}
      </PageSection>
    </PageContainer>
  );
}
