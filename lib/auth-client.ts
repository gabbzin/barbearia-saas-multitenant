import { createAuthClient } from "better-auth/react";
import { auth } from "./auth";
import { stripeClient } from "@better-auth/stripe/client";

export const authClient = createAuthClient({
  plugins: [
    stripeClient({
      subscription: true,
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;