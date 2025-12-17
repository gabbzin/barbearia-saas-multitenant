import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { stripe } from "@better-auth/stripe";
import { stripeClient } from "./stripe-client";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
      },
    },
  },

  plugins: [
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans: [
          {
            name: "Corte ilimitado",
            priceId: "price_1Sf3aPLZmTtv3cllAd2ewhDQ",
          },
          {
            name: "Barba ilimitada",
            priceId: "price_1SfJCWLZmTtv3cllEvJ1kLV8",
          },
          {
            name: "Corte + Barba ilimitados",
            priceId: "price_1SfJCmLZmTtv3cllXAzpWq1a",
          },
        ],
      },
    }),
  ],
});
