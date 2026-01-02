import { verifySession } from "@/features/user/repository/user.repository";
import { basePrisma, getTenantPrisma } from "./prisma";

// Esta função recupera o cliente Prisma correto para a requisição atual
async function getContextualDb() {
  try {
    const session = await verifySession();

    const tenantId = session?.tenantId;

    if (!tenantId) {
      // Se não houver tenant na sessão, retorna o Prisma base (sem filtros)
      // Ou você pode lançar um erro se quiser que o app seja 100% privado
      return basePrisma;
    }

    return getTenantPrisma(tenantId);
  } catch (error) {
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
