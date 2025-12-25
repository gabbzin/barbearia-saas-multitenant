"use client";

import { useRouter } from "next/navigation"; // Use router.push em Client Components
import { toast } from "sonner";
import {
  registerSchema,
  type registerSchemaType,
} from "@/features/user/schema/userSchema";
import { authClient } from "@/lib/auth-client";
import GenericForm from "@/shared/components/form/generic-form";
import InputForm from "@/shared/components/form/input-form";
import { GoogleButton } from "@/shared/components/google-button";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";

const RegisterForm = () => {
  const router = useRouter();

  const handleRegister = async (data: registerSchemaType) => {
    try {
      const user = await authClient.signUp.email({
        name: data.nome,
        email: data.email,
        password: data.senha,
      });

      if (user.error) {
        throw new Error(user.error.message);
      }
      router.push("/");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao criar conta. Tente novamente.",
      );
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center font-bold text-3xl">
        Criar conta
      </CardHeader>
      <CardContent className="px-8">
        <GenericForm<registerSchemaType>
          schema={registerSchema}
          onSubmit={handleRegister}
          submitText="Criar conta"
          buttons={<GoogleButton />}
        >
          <InputForm
            name="nome"
            label="Nome"
            type="text"
            placeholder="Digite seu nome"
          />
          <InputForm
            name="email"
            label="Email"
            type="email"
            placeholder="Digite seu email"
          />
          <InputForm
            name="senha"
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
          />
        </GenericForm>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
