/** biome-ignore-all lint/suspicious/noExplicitAny: <Pode usar any dboa> */

import { cookies } from "next/headers";
import { verifySession } from "@/features/user/repository/user.repository";
import { basePrisma, getTenantPrisma } from "@/lib/prisma";

// Esta função recupera o cliente Prisma correto para a requisição atual
async function getContextualDb() {
  try {
    const session = await verifySession();

    const cookieStore = await cookies();

    cookieStore.get("tenantSlug");

    const tenantId = session?.tenantId;

    if (!tenantId) {
      throw new Error("Tenant ID não encontrado na sessão.");
    }

    return getTenantPrisma(tenantId);
  } catch (_error: any) {
    // Fallback para o prisma base caso headers() falhe (ex: fora do ciclo de request)
    return basePrisma;
  }
}

// Criamos um Proxy que intercepta qualquer chamada ao "db"
export const db = new Proxy({} as ReturnType<typeof getTenantPrisma>, {
  get(_target, prop) {
    // O truque: retornamos uma função que, quando executada, busca o DB e o modelo
    return new Proxy(
      {},
      {
        get(_, modelOp) {
          return async (...args: any[]) => {
            const client = await getContextualDb();
            return (client as any)[prop][modelOp](...args);
          };
        },
      },
    );
  },
});
