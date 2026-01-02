import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import LoginForm from "./login-form";

export default async function LoginPage(props: PageProps<"/[slug]">) {
  const { slug } = await props.params;

  const tenant = await prisma.barbershop.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!tenant) {
    return notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <Image
        src={"/Background.png"}
        alt="Background"
        fill
        className="-z-10 object-cover brightness-50"
      />
      <LoginForm slug={slug} tenantId={tenant.id} />
    </main>
  );
}
