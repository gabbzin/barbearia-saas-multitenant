import { z } from "zod";

export const timesSchema = z
  .object({
    // Mapeia cada dia da semana como um booleano opcional
    0: z.boolean().default(false),
    1: z.boolean().default(false),
    2: z.boolean().default(false),
    3: z.boolean().default(false),
    4: z.boolean().default(false),
    5: z.boolean().default(false),
    6: z.boolean().default(false),

    // Validação de horário no formato "HH:mm"
    horario_abertura: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: "Use o formato HH:mm (ex: 09:00)",
    }),
    horario_fechamento: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: "Use o formato HH:mm (ex: 18:00)",
    }),
  })
  .refine(
    data => {
      // Validação extra: Fechamento deve ser depois da Abertura
      const [hAbertura, mAbertura] = data.horario_abertura
        .split(":")
        .map(Number);
      const [hFechamento, mFechamento] = data.horario_fechamento
        .split(":")
        .map(Number);

      const totalMinutosAbertura = hAbertura * 60 + mAbertura;
      const totalMinutosFechamento = hFechamento * 60 + mFechamento;

      return totalMinutosFechamento > totalMinutosAbertura;
    },
    {
      message: "O horário de fechamento deve ser após o horário de abertura",
      path: ["horario_fechamento"], // O erro aparecerá no campo de fechamento
    },
  );

// Tipo exportado para usar no seu componente/form se precisar
export type TimesSchemaData = z.infer<typeof timesSchema>;
