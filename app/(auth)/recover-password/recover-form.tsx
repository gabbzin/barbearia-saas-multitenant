"use client";

import Link from "next/link";
import {
  recoverPasswordSchema,
  type recoverPasswordSchemaType,
} from "@/features/user/schema/userSchema";
import GenericForm from "@/shared/components/form/generic-form";
import InputForm from "@/shared/components/form/input-form";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { PasswordStrength } from "./passwordStrength";

export default function RecoverPassword() {
  const handleRecoverPassword = (data: recoverPasswordSchemaType) => {
    console.log(data);
  };

  return (
    <Card className="w-full max-w-md space-y-2">
      <CardHeader className="text-center font-bold text-2xl">
        Recuperar senha
      </CardHeader>
      <CardContent className="px-8">
        <GenericForm
          schema={recoverPasswordSchema}
          onSubmit={handleRecoverPassword}
          submitText="Criar nova senha"
          buttons={
            <Button variant={"destructive"} type="button" asChild>
              <Link href={"/login"}>Voltar</Link>
            </Button>
          }
        >
          <InputForm
            name="email"
            label="Email"
            type="email"
            placeholder="Digite seu email"
          />
          <InputForm
            name="senha"
            label="Nova senha"
            type="password"
            placeholder="Digite sua nova senha"
          />
          <InputForm
            name="confirmarSenha"
            label="Confirmar nova senha"
            type="password"
            placeholder="Digite sua nova senha"
          />
          <PasswordStrength fieldName="senha" />
        </GenericForm>
      </CardContent>
    </Card>
  );
}
