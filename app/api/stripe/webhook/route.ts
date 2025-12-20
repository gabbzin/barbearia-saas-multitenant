import { NextResponse } from "next/server";
import { stripeClient } from "@/lib/stripe-client";
import { handleCheckoutCompleted } from "./handlers/handleCheckoutCompleted";
import { handleRefund } from "./handlers/handleRefund";
import { handleSignatureCompleted } from "./handlers/handleSignatureCompleted";
import { handleSignatureDeleted } from "./handlers/handleSignatureDeleted";

export const POST = async (request: Request) => {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.error();
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.error();
  }

  const text = await request.text();

  const event = stripeClient.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET,
  );

  // Validando os eventos
  switch (event.type) {
    // Finalização do checkout
    case "checkout.session.completed": {
      await handleCheckoutCompleted(event);
      break;
    }
    // Assinatura criada
    case "customer.subscription.created": {
      await handleSignatureCompleted(event);
      break;
    }
    case "customer.subscription.updated": {
      // await handleSignatureUpdated(event);
      break;
    }
    case "customer.subscription.deleted": {
      await handleSignatureDeleted(event);
      break;
    }
    case "charge.refunded": {
      await handleRefund(event);
      break;
    }
  }

  return NextResponse.json({ received: true });
};
