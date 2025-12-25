"use server";

import { getCurrentSubscription } from "@/features/user/repository/user.repository";

export async function getCurrentSubscriptionAction() {
  return await getCurrentSubscription();
}
