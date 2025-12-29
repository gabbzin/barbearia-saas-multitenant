"use client";

import type { Barber, BarberService, Booking, User } from "@prisma/client";
import { useState } from "react";
import BookingItem from "@/features/booking/components/booking-item";
import { CancelBooking } from "@/features/booking/components/cancel-booking";
import { PageContainer, PageSection } from "@/shared/components/ui/page";

interface BookingsClientProps {
  bookings: (Booking & {
    service: BarberService & {
      barber: Barber & {
        user: User | null;
      };
    };
  })[];
}

export type BookingClient = {
  id: string;
  date: Date;
  stripeChargeId?: string | null;
  service: {
    name: string;
    priceInCents: number;
  };
  barber: {
    name: string;
    imageUrl: string;
    phone: string[];
  };
};

export default function BookingsClient({ bookings }: BookingsClientProps) {
  const [selectedBooking, setSelectedBooking] = useState<
    BookingClient | null
  >(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const now = new Date();

  const confirmedBookings = bookings.filter(
    booking => booking.date > now && booking.status === "SCHEDULED",
  );

  const cancelledBookings = bookings.filter(
    booking => booking.status === "CANCELLED",
  );

  const finishedBookings = bookings.filter(
    booking => booking.date <= now && booking.status !== "CANCELLED",
  );

  const handleClickBooking = (booking: BookingClient) => {
    setSelectedBooking(booking);
    setIsSheetOpen(true);
  };

  return (
    <>
      <PageContainer>
        <h1 className="font-bold text-xl">Agendamentos</h1>
        <PageSection>
          <h2 className="font-bold text-muted-foreground text-xs uppercase">
            Confirmados
          </h2>
          {confirmedBookings.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Você não tem agendamentos confirmados.
            </p>
          ) : (
            confirmedBookings.map(booking => (
              <BookingItem
                key={booking.id}
                serviceName={booking.service.name}
                date={booking.date}
                counterPart={{
                  name: booking.service.barber.user?.name ?? "Barbeiro",
                  imageUrl: booking.service.barber.imageUrl,
                }}
                status="confirmed"
                onClick={() =>
                  handleClickBooking({
                    id: booking.id,
                    date: booking.date,
                    stripeChargeId: booking.stripeChargeId,
                    service: {
                      name: booking.service.name,
                      priceInCents: booking.service.priceInCents,
                    },
                    barber: {
                      name: booking.service.barber.user?.name ?? "Barbeiro",
                      imageUrl: booking.service.barber.imageUrl,
                      phone: booking.service.barber.phone,
                    },
                  })
                }
              />
            ))
          )}
        </PageSection>
        <PageSection>
          <h2 className="font-bold text-muted-foreground text-xs uppercase">
            Cancelados
          </h2>
          {cancelledBookings.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Você não tem agendamentos cancelados.
            </p>
          ) : (
            cancelledBookings.map(booking => (
              <BookingItem
                key={booking.id}
                serviceName={booking.service.name}
                date={booking.date}
                counterPart={{
                  name: booking.service.barber.user?.name ?? "Barbeiro",
                  imageUrl: booking.service.barber.imageUrl,
                }}
                status="cancelled"
              />
            ))
          )}
        </PageSection>
        <PageSection>
          <h2 className="font-bold text-muted-foreground text-xs uppercase">
            Finalizados
          </h2>
          {finishedBookings.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Você não tem agendamentos finalizados.
            </p>
          ) : (
            finishedBookings.map(booking => (
              <BookingItem
                key={booking.id}
                serviceName={booking.service.name}
                date={booking.date}
                counterPart={{
                  name: booking.service.barber.user?.name ?? "Barbeiro",
                  imageUrl: booking.service.barber.imageUrl,
                }}
                status="finished"
              />
            ))
          )}
        </PageSection>
      </PageContainer>

      <CancelBooking
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        booking={selectedBooking}
      />
    </>
  );
}
