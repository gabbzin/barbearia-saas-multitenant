import Stripe from "stripe";

if (process.env.STRIPE_SECRET_KEY === undefined) {
  throw new Error("Stripe secret key is not configured.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-07-30.basil",
});
