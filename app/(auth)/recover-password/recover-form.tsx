"use client";

import InputForm from "@/app/_components/form/input-form";
import GenericForm from "@/app/_components/form/generic-form";
import { loginSchema } from "@/schemas/userSchema";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import Link from "next/link";
import { Button } from "@/app/_components/ui/button";
import { PasswordStrength } from "./passwordStrength";
import { auth } from "@/lib/auth";

export default function RecoverPassword() {
  // const handleRecover = async () => {
  //   try {
  //     const res = await auth.api.changePassword({
        
  //     })
  //   }
  // }

  return (
    <>
      <Card className="w-full max-w-md space-y-2">
        <CardHeader className="text-center text-3xl font-bold">
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
    </>
  );
}
