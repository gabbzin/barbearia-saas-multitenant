"use client";

import { confirmBooking } from "@/app/_actions/bookings/confirm-booking";
import { Avatar, AvatarImage } from "@/app/_components/ui/avatar";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import { useBookings } from "@/hooks/useBookings";
import { format } from "date-fns";

export function ScheduleCard({ barberId }: { barberId: string }) {
  const { data: bookings } = useBookings(barberId);

  return (
    <div>
      {bookings && bookings.length > 0 ? (
        bookings.map((booking) => (
          <Card key={booking.id} className="mb-4">
            <CardContent>
              <div className="flex items-center gap-4 font-semibold">
                <Avatar>
                  <AvatarImage
                    src={"https://github.com/shadcn.png"}
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
                  {/* {booking.date.toTimeString().substring(0, 5)} */}
                  {format(new Date(booking.date), "dd/MM/yyyy HH:mm")}
                </p>
              </div>
              <div className="mt-6 flex items-center justify-center gap-8">
                <Button variant={"destructive"}>Cancelar</Button>
                <Button
                  variant={"success"}
                  onClick={() => confirmBooking(booking.id)}
                >
                  Confirmar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p>Sem agendamentos para hoje</p>
      )}
    </div>
  );
}
