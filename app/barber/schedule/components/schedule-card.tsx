"use client";

import { format } from "date-fns";
import { useAction } from "next-safe-action/hooks";
import { useBookings } from "@/features/booking/hooks/useBookings";
import { confirmBookingAction } from "@/shared/actions/confirm-booking-checkout";
import ConfirmAlertDialog from "@/shared/components/confirm-alert-dialog";
import { SpinLoader } from "@/shared/components/spinLoader";
import { Avatar, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardFooter } from "@/shared/components/ui/card";

interface contentCardProps {
  booking: any;
  footer?: React.ReactNode;
}

function ContentCard({ booking, footer }: contentCardProps) {
  return (
    <>
      <CardContent>
        <div className="flex items-center gap-4 font-semibold">
          <Avatar>
            <AvatarImage
              src={booking.user.image ?? "https://github.com/shadcn.png"}
              alt={booking.user.name ?? "User Avatar"}
              className="object-cover"
            />
          </Avatar>
          <p>{booking.user.name}</p>
        </div>
        <div className="space-y-1">
          <p>
            <span className="font-bold">Serviço: </span>
            {booking.service.name}
          </p>
          <p>
            <span className="font-bold">Horário: </span>
            {format(new Date(booking.date), "dd/MM/yyyy HH:mm")}
          </p>
        </div>
      </CardContent>
      <CardFooter>{footer}</CardFooter>
    </>
  );
}

export function ScheduleCard({ barberId }: { barberId: string }) {
  const { data: bookings, isLoading } = useBookings(barberId);

  const { execute, isPending } = useAction(confirmBookingAction);

  const completedBookings = bookings?.filter(
    booking => booking.status === "COMPLETED",
  );

  const incompletedBookings = bookings?.filter(
    booking => booking.status !== "COMPLETED",
  );

  if (isLoading) {
    return <SpinLoader />;
  }

  return (
    <div>
      {incompletedBookings && incompletedBookings.length > 0 && (
        <>
          <h3 className="mt-8 mb-4 font-bold text-lg">
            Agendamentos Pendentes
          </h3>
          <div>
            {incompletedBookings?.map(booking => (
              <Card key={booking.id} className="mb-4">
                <ContentCard
                  booking={booking}
                  footer={
                    <div className="flex w-full items-center justify-around gap-3 pt-3">
                      <Button variant={"destructive"}>Cancelar</Button>
                      <ConfirmAlertDialog
                        title="Confirmar"
                        isLoading={isPending}
                        handleConfirm={() => execute({ bookingId: booking.id })}
                      >
                        <Button variant={"success"}>Confirmar</Button>
                      </ConfirmAlertDialog>
                    </div>
                  }
                />
              </Card>
            ))}
          </div>
        </>
      )}
      {completedBookings && completedBookings.length > 0 && (
        <>
          <h3 className="mt-8 mb-4 font-bold text-lg">
            Agendamentos Concluídos
          </h3>
          <div>
            {completedBookings?.map(booking => (
              <Card key={booking.id} className="mb-4">
                <ContentCard booking={booking} />
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
