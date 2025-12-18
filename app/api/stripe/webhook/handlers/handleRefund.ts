import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";

export async function handleRefund(event: Stripe.Event) {
  const refund = event.data.object as Stripe.Refund;

  const chargeId =
    typeof refund.charge === "string" ? refund.charge : refund.charge?.id;

  if (!chargeId) return;

  await prisma.booking.update({
    where: {
      stripeChargeId: chargeId,
    },
    data: {
      status: "CANCELLED",
      cancelledAt: new Date(),
    },
  });

  revalidatePath("/bookings");
}
