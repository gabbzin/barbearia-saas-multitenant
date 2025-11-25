import { convertToModelMessages, streamText } from "ai";
import { google } from "@ai-sdk/google";

export const POST = async (request: Request) => {
  const { messages } = await request.json();

  const result = streamText({
    model: google("gemini-2.0-flash"),
    system: `Você é o Agenda.ai, um assistente virtual de agendamento de barbearias.

    DATA ATUAL: Hoje é ${new Date().toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}

    Seu objetivo é ajudar os usuários a:
    - Encontrar barbearias (por nome ou todas disponíveis)
    - Verificar disponibilidade de horários para barbearias específicas
    - Fornecer informações sobre serviços e preços

    Fluxo de atendimento:

    CENÁRIO 1 - Usuário menciona data/horário na primeira mensagem (ex: "quero um corte pra hoje", "preciso cortar o cabelo amanhã", "quero marcar para sexta"):
    1. Use a ferramenta searchBarbershops para buscar barbearias
    2. IMEDIATAMENTE após receber as barbearias, use a ferramenta getAvailableTimeSlotsForBarbershop para CADA barbearia retornada, passando a data mencionada pelo usuário
    3. Apresente APENAS as barbearias que têm horários disponíveis, mostrando:
       - Nome da barbearia
       - Endereço
       - Serviços oferecidos com preços
       - Alguns horários disponíveis (4-5 opções espaçadas)
    4. Quando o usuário escolher, forneça o resumo final

    CENÁRIO 2 - Usuário não menciona data/horário inicialmente:
    1. Use a ferramenta searchBarbershops para buscar barbearias
    2. Apresente as barbearias encontradas com:
       - Nome da barbearia
       - Endereço
       - Serviços oferecidos com preços
    3. Quando o usuário demonstrar interesse em uma barbearia específica ou mencionar uma data, pergunte a data desejada (se ainda não foi informada)
    4. Use a ferramenta getAvailableTimeSlotsForBarbershop passando o barbershopId e a data
    5. Apresente os horários disponíveis (liste alguns horários, não todos - sugira 4-5 opções espaçadas)

    Resumo final (quando o usuário escolher):
    - Nome da barbearia
    - Endereço
    - Serviço escolhido
    - Data e horário escolhido
    - Preço

    Criação da reserva:
    - Após o usuário confirmar explicitamente a escolha (ex: "confirmo", "pode agendar", "quero esse horário"), use a ferramenta createBooking
    - Parâmetros necessários:
      * serviceId: ID do serviço escolhido
      * date: Data e horário no formato ISO (YYYY-MM-DDTHH:mm:ss) - exemplo: "2025-11-05T10:00:00"
    - Se a criação for bem-sucedida (success: true), informe ao usuário que a reserva foi confirmada com sucesso
    - Se houver erro (success: false), explique o erro ao usuário:
      * Se o erro for "User must be logged in", informe que é necessário fazer login para criar uma reserva
      * Para outros erros, informe que houve um problema e peça para tentar novamente

    Importante:
    - NUNCA mostre informações técnicas ao usuário (barbershopId, serviceId, formatos ISO de data, etc.)
    - Seja sempre educado, prestativo e use uma linguagem informal e amigável
    - Não liste TODOS os horários disponíveis, sugira apenas 4-5 opções espaçadas ao longo do dia
    - Se não houver horários disponíveis, sugira uma data alternativa
    - Quando o usuário mencionar "hoje", "amanhã", "depois de amanhã" ou dias da semana, calcule a data correta automaticamente`,
    messages: convertToModelMessages(messages),
    //   tools: {
    //     // São aqui que definimos as ferramentas disponíveis para o modelo
    //     searchBarbershops: tool({
    //       description:
    //         "Pesquisa barbearias pelo nome. Se nenhum nome é fornecido, retorna todas as barbearias",
    //       inputSchema: z.object({
    //         name: z.string().optional().describe("Nome opcional da barbearia"),
    //       }),
    //       execute: async ({ name }) => {
    //         if (!name?.trim()) {
    //           const barbers = await prisma.barber.findMany({
    //             include: {
    //               services: true,
    //             },
    //           });
    //           return barbers.map((barber) => ({
    //             id: barber.id,
    //             name: barber.name,
    //             services: barber.services.map((service) => ({
    //               name: service.name,
    //               description: service.description,
    //               price: service.priceInCents / 100,
    //               imageUrl: service.imageUrl,
    //             })),
    //           }));
    //         }

    //         const barbers = await prisma.barber.findMany({
    //           where: {
    //             name: {
    //               contains: name,
    //               mode: "insensitive",
    //             },
    //           },
    //         });

    //         return barbers;
    //       },
    //     }),
    //     getAvailableTimeSlotsForBarbershop: tool({
    //       description:
    //         "Obtém os horários disponíveis para uma barbearia em uma data específica",
    //       inputSchema: z.object({
    //         barbershopId: z.uuid().describe("ID da barbearia"),
    //         date: z
    //           .string()
    //           .describe(
    //             "Data em ISOString para verificar os horários disponíveis",
    //           ),
    //       }),
    //       execute: async ({ barbershopId, date }) => {
    //         const parsedDate = new Date(date);
    //         const result = await getDateAvailableTimeSlots({
    //           barberId: barbershopId,
    //           date: parsedDate,
    //         });

    //         if (result.serverError || result.validationErrors) {
    //           return {
    //             error: result.validationErrors?._errors?.[0],
    //           };
    //         }

    //         return {
    //           barbershopId,
    //           date,
    //           availableTimeSlots: result.data,
    //         };
    //       },
    //     }),
    //   },
    // });

    // return result.toUIMessageStreamResponse();
  });

  return result.toTextStreamResponse();
};
