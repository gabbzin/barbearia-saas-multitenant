import { NextResponse } from "next/server";
import { stripeClient } from "@/lib/stripe-client";
import { handleCheckoutCompleted } from "./handlers/handleCheckoutCompleted";
import { handleRefund } from "./handlers/handleRefund";
import { handleSignatureDeleted } from "./handlers/handleSubscriptionDeleted";
import { handleSubscriptionUpdated } from "./handlers/handleSubscriptionUpdated";
import { handleInvoicePaid } from "./handlers/handleInvoicePaid";

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
    // Reembolso realizado
    case "charge.refunded": {
      await handleRefund(event);
      break;
    }
    // Assinatura atualizada
    case "customer.subscription.updated": {
      await handleSubscriptionUpdated(event);
      break;
    }
    case "invoice.paid": {
      await handleInvoicePaid(event);
      break;
    }
    // Cancelar assinatura
    case "customer.subscription.deleted": {
      await handleSignatureDeleted(event);
      break;
    }
  }

  return NextResponse.json({ received: true });
};
