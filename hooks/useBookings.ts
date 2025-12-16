"use client";

import { getBookings } from "@/app/_actions/bookings/get-bookings";
import { useQuery } from "@tanstack/react-query";

export function useBookings(barberId: string) {
  return useQuery({
    queryKey: ["bookings", barberId],
    queryFn: async () => getBookings(barberId),
  });
}
