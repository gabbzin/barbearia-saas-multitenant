import { createAuthClient } from "better-auth/react";
import { auth } from "./auth";

export const authClient = createAuthClient({

});

export type Session = typeof auth.$Infer.Session;