"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentSubscriptionAction } from "@/app/_actions/signatures/get-current-subscription";

export const useGetSubscription = () =>
  useQuery({
    queryKey: ["subscription"],
    queryFn: async () => await getCurrentSubscriptionAction(),
    refetchOnWindowFocus: false,
  });
