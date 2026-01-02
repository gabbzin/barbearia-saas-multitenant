import { notFound, redirect } from "next/navigation";
import { verifySession } from "@/features/user/repository/user.repository";
import { prisma } from "@/lib/prisma";

interface AuthLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function AuthLayout({
  children,
  params,
}: AuthLayoutProps) {
  const { slug } = await params;

  const tenant = await prisma.barbershop.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
    },
  });

  if (!tenant) {
    return notFound();
  }

  const session = await verifySession();

  if (session) {
    return redirect(`/${slug}`);
  }

  return <>{children}</>;
}
