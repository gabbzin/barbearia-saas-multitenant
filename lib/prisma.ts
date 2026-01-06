/** biome-ignore-all lint/suspicious/noExplicitAny: <Sem preocupações com any> */
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 1. Singleton para evitar "Too many clients" no Next.js Dev
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const basePrisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = basePrisma;

export const getTenantPrisma = (tenantId: string) => {
  if (!tenantId) {
    throw new Error("TenantId obrigatório para prisma tenant-scoped");
  }

  return basePrisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const tenantModels = [
            "Barber",
            "BarberService",
            "Booking",
            "Subscription",
            "Plan",
            "UserTenant",
          ];

          if (tenantModels.includes(model)) {
            const anyArgs = args as any;

            // Filtros de Leitura
            if (
              [
                "findFirst",
                "findMany",
                "findUnique",
                "count",
                "aggregate",
              ].includes(operation)
            ) {
              anyArgs.where = { ...anyArgs.where, tenantId };
            }

            // Criação
            if (operation === "create" || operation === "createMany") {
              if (Array.isArray(anyArgs.data)) {
                anyArgs.data = anyArgs.data.map((item: any) => ({
                  ...item,
                  tenantId,
                }));
              } else {
                anyArgs.data = { ...anyArgs.data, tenantId };
              }
            }

            // Atualização e Deleção
            if (
              [
                "update",
                "updateMany",
                "upsert",
                "delete",
                "deleteMany",
              ].includes(operation)
            ) {
              anyArgs.where = { ...anyArgs.where, tenantId };
            }
          }

          return query(args);
        },
      },
    },
  });
};

// Atalho exportado
export const prisma = basePrisma;
