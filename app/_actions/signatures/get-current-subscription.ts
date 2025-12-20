"use server";

import { getCurrentSubscription } from "@/services/user.service";

export async function getCurrentSubscriptionAction() {
  return await getCurrentSubscription();
}
