import Image from "next/image";
import { redirect } from "next/navigation";
import { verifyEmail } from "@/lib/resend/sendVerifyEmail";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function VerifyAccountPage({ searchParams }: Props) {
  const token = (await searchParams).token as string | undefined;
  const slug = (await searchParams).slug as string | undefined;

  try {
    if (!token) {
      throw new Error("Token is required");
    }
    if (!slug) {
      throw new Error("Slug is required");
    }

    await verifyEmail(token);
    redirect(`/${slug}/login?verified=true`);
  } catch {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4">
        <Image
          src={"/Background.png"}
          alt="Background"
          fill
          className="-z-10 object-cover brightness-50"
        />
        <Card className="w-full max-w-md">
          <CardHeader className="text-center font-bold text-3xl">
            Erro ao verificar email ❌
          </CardHeader>
          <CardContent className="px-8">
            <p>
              O link de verificação expirou ou é inválido. Por favor, solicite
              um novo email de verificação.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }
}
