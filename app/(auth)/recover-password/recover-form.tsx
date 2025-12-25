"use client";

import Link from "next/link";
import { loginSchema } from "@/features/user/schema/userSchema";
import GenericForm from "@/shared/components/form/generic-form";
import InputForm from "@/shared/components/form/input-form";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { PasswordStrength } from "./passwordStrength";

export default function RecoverPassword() {
  // const handleRecover = async () => {
  //   try {
  //     const res = await auth.api.changePassword({

  //     })
  //   }
  // }

  return (
    <Card className="w-full max-w-md space-y-2">
      <CardHeader className="text-center font-bold text-3xl">
        Recuperar senha
      </CardHeader>
      <CardContent className="px-8">
        <GenericForm
          schema={loginSchema}
          onSubmit={() => {}}
          submitText="Criar nova senha"
          buttons={
            <Button variant={"destructive"} type="button" asChild>
              <Link href={"/login"}>Voltar</Link>
            </Button>
          }
        >
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
