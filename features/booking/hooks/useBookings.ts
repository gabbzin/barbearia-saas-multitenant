"use client";

import { useQuery } from "@tanstack/react-query";
import { getBookings } from "@/shared/actions/bookings/get-bookings";

export function useBookings(barberId: string) {
  return useQuery({
    queryKey: ["bookings", barberId],
    queryFn: async () => getBookings(barberId),
  });
}
