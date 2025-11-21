import { stripe } from "@/lib/stripe-client";
import { NextResponse } from "next/server";
import { handleCheckoutCompleted } from "./handlers/handleCheckoutCompleted";

export const POST = async (request: Request) => {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.error();
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.error();
  }

  const text = await request.text();

  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET,
  );

  // Validando os eventos
  switch (event.type) {
    case "checkout.session.completed": {
      await handleCheckoutCompleted(event);
      break;
    }
  }
};
