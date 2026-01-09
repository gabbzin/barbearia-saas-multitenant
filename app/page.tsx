import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/shared/components/ui/card";

const IMAGES = [
  "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1976&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=1974&auto=format&fit=crop",
];

export default async function HomePage() {
  await authClient.signOut();
  const barberShops = await prisma.barbershop.findMany();

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="flex h-screen flex-col items-center justify-center gap-5 bg-radial from-0% from-[#1a1a1a] to-100% to-[#0a0a0a] text-center">
        <h1 className="font-extrabold font-inter text-3xl lg:text-5xl">
          Barbearia SaaS Project
        </h1>
        <p className="text-xl">
          Uma plataforma white-label de gestão desenvolvida para modernizar
          barbearias.
        </p>
      </header>
      <main className="">
        <h2 className="mt-16 text-center font-extrabold font-inter text-4xl text-[#D4AF37]">
          Barbearias Ativas no Sistema
        </h2>
        <section className="grid gap-6 p-8 md:grid-cols-2 lg:grid-cols-3 lg:p-24">
          {barberShops.map((bs, index) => (
            <Link href={`/${bs.slug}`} key={bs.id}>
              <Card className="relative min-h-[400px] cursor-pointer overflow-hidden rounded-xl border-[#D4AF37] shadow-lg hover:shadow-2xl">
                <CardContent className="">
                  <div className="absolute top-0 left-0 z-10 h-full w-full rounded-lg bg-linear-to-t from-black to-transparent" />
                  <Image
                    src={IMAGES[index]}
                    alt={bs.name}
                    fill
                    className="object-cover transition-transform duration-400 hover:scale-105"
                  />
                  <div className="absolute right-0 bottom-0 left-0 z-20 ml-3 w-3/4 p-4 font-inter text-white">
                    <h3 className="font-extrabold text-2xl uppercase lg:text-3xl">
                      {bs.name}
                    </h3>
                    <p className="mt-2 text-muted-foreground text-sm">
                      {bs.address}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
