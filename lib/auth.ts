import { stripe } from "@better-auth/stripe";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { getSlugByCookie } from "./funcs/get-slug-cookie";
import { prisma } from "./prisma";
import { sendRecoveryEmail } from "./emails/sendRecoveryEmail";
import { sendVerificationEmail } from "./emails/sendVerifyEmail";
import { stripeClient } from "./stripe-client";
import { getTenantIdByCookie } from "./funcs/get-tenantId-cookie";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, token }) => {
      await sendRecoveryEmail({
        to: [user.email],
        token,
        userName: user.name,
        barberShopSlug: await getSlugByCookie(),
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  user: {
    additionalFields: {
      stripeCustomerId: {
        type: "string",
      },
      tenantId: {
        type: "string",
      },
    },
  },

  session: {
    additionalFields: {
      tenantId: {
        type: "string",
      },
    },
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async user => {
          const tenantId = await getTenantIdByCookie();

          return {
            data: {
              ...user,
              tenantId: tenantId ?? null,
            },
          };
        },
        after: async user => {
          const tenantId = await getTenantIdByCookie();

          if (tenantId) {
            await prisma.userTenant.create({
              data: { userId: user.id, tenantId, role: "CLIENT" },
            });
          }
        },
      },
    },

    session: {
      create: {
        before: async session => {
          const tenantId = await getTenantIdByCookie();

          if (tenantId) {
            await prisma.userTenant.upsert({
              where: {
                userId_tenantId: { userId: session.userId, tenantId },
              },
              create: { userId: session.userId, tenantId, role: "CLIENT" },
              update: {},
            });

            const globalPlanFree = await prisma.plan.findFirstOrThrow({
              where: {
                name: "FREE",
                tenantId: null,
              },
            });

            if (globalPlanFree) {
              await prisma.subscription.upsert({
                where: {
                  userId_tenantId: {
                    userId: session.userId,
                    tenantId,
                  },
                },
                create: {
                  userId: session.userId,
                  planId: globalPlanFree.id,
                  tenantId,
                  status: "ACTIVE",
                  periodStart: new Date(),
                  // Plano gratuito sem data de término
                  periodEnd: null,
                },
                update: {},
              });
            }
            return {
              data: {
                ...session,
                tenantId,
              },
            };
          }
        },
      },
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, token }) => {
      await sendVerificationEmail({
        to: [user.email],
        token,
        userName: user.name,
        barbershopSlug: await getSlugByCookie(),
      });
    },
    expiresIn: 60 * 15, // 15 minutes
  },

  plugins: [
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET as string,
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans: [
          {
            name: "FREE",
            priceId: "",
          },
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
