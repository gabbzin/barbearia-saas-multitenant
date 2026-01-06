import { revalidatePath } from "next/cache";
import type Stripe from "stripe";
import { db } from "@/lib/funcs/get-db";

export async function handleRefund(event: Stripe.Event) {
  const refund = event.data.object as Stripe.Refund;

  const chargeId =
    typeof refund.charge === "string" ? refund.charge : refund.charge?.id;

  if (!chargeId) return;

  await db.booking.update({
    where: {
      stripeChargeId: chargeId,
    },
    data: {
      // Colocar status de reembolsado também
      status: "CANCELLED",
      cancelledAt: new Date(),
    },
  });

  revalidatePath("/bookings");
}
