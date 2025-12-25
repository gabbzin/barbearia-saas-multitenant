"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentSubscriptionAction } from "@/features/signature/actions/get-current-subscription";

export const useGetSubscription = () =>
  useQuery({
    queryKey: ["subscription"],
    queryFn: async () => await getCurrentSubscriptionAction(),
    refetchOnWindowFocus: false,
  });
