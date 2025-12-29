"use server";

import { revalidatePath } from "next/cache";
import { returnValidationErrors } from "next-safe-action";
import { object, string } from "zod";
import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";
import { getBookingsUser } from "../functions/get-bookings";

const inputSchema = object({
  userId: string(),
});

export const getBookingsUserIdAction = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput }: { parsedInput: { userId: string } }) => {
    const userId = parsedInput.userId;
    const session = await verifySession();

    if (!session) {
      returnValidationErrors(inputSchema, {
        _errors: ["Usuário não autenticado."],
      });
    }

    await getBookingsUser(userId);

    revalidatePath("/bookings");
    return { success: true };
  });
