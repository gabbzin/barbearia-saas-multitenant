"use client";

import { useQuery } from "@tanstack/react-query";
import { getBookings } from "@/features/booking/functions/get-bookings";

export function useBookings(barberId: string) {
  return useQuery({
    queryKey: ["bookings", barberId],
    queryFn: async () => getBookings(barberId),
  });
}
