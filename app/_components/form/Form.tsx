"use client";

import { useForm } from "react-hook-form";
import InputForm from "./InputForm";
import { loginSchema, loginSchemaType } from "@/schemas/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { GoogleButton } from "../google-button";

const Buttons = ({ children }: { children: React.ReactNode }) => {
  return <div className="mt-4 flex flex-col gap-4 font-bold">{children}</div>;
};

const Form = () => {
  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: loginSchemaType) => {
    console.log(data);
    try {
      await authClient.signIn.email({
        email: data.email,
        password: data.senha,
      });
      redirect("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <InputForm
          control={control}
          name="email"
          placeholder="Digite seu email"
          type="email"
          label="Email"
        />
        <InputForm
          control={control}
          name="senha"
          placeholder="Digite sua senha"
          type="password"
          label="Senha"
        />

        <Buttons>
          <Button variant={"default"} type="submit" disabled={isSubmitting}>
            Realizar login
          </Button>
          <GoogleButton />
        </Buttons>
      </form>
    </>
  );
};

export default Form;
