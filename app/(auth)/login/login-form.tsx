"use client";

import InputForm from "@/app/_components/form/input-form";
import GenericForm from "@/app/_components/form/generic-form";
import { loginSchema, loginSchemaType } from "@/schemas/userSchema";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation"; // Use router.push em Client Components
import { GoogleButton } from "@/app/_components/google-button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/app/_components/ui/card";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();

  const handleLogin = async (data: loginSchemaType) => {
    try {
      const user = await authClient.signIn.email({
        email: data.email,
        password: data.senha,
      });

      if (user.error) {
        throw new Error(user.error.message);
      }

      router.refresh();
      router.push("/");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao fazer login. Tente novamente.",
      );
    }
  };

  return (
    <Card className="w-full max-w-md space-y-2">
      <CardHeader className="text-center text-3xl font-bold">
        Fazer login
      </CardHeader>
      <CardContent className="px-8">
        <GenericForm
          schema={loginSchema}
          onSubmit={handleLogin}
          submitText="Logar conta"
          buttons={<GoogleButton />}
        >
          <InputForm
            name="email"
            label="Email"
            type="email"
            placeholder="Digite seu email"
          />
          <div className="relative">
            <InputForm
              name="senha"
              label="Senha"
              type="password"
              placeholder="Digite sua senha"
            />
            <p className="absolute right-0 text-sm text-blue-500">
              <Link href={"/recover-password"}>Esqueceu a senha?</Link>
            </p>
          </div>
        </GenericForm>
      </CardContent>
      <CardFooter className="flex flex-col">
        <p className="w-4/6 text-center">Ainda não possui conta? </p>
        <Link href={"/register"} className="text-blue-500">
          Crie uma agora.
        </Link>
      </CardFooter>
    </Card>
  );
}
