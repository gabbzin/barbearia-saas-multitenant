"use client";

import { authClient } from "@/lib/auth-client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import {
  MenuIcon,
  Home,
  Calendar,
  LogOut,
  LogIn,
  CreditCard,
  Scissors,
} from "lucide-react";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Barber, User } from "@/generated/prisma";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const ROUTES = [
  { name: "Início", path: "/", icon: Home },
  { name: "Barbeiros", path: "/barber", icon: Scissors },
  { name: "Agendamentos", path: "/bookings", icon: Calendar },
  { name: "Assinatura", path: "/signature", icon: CreditCard },
];

export const SidebarMenu = ({
  barbers,
}: {
  barbers: (Barber & { user: User })[];
}) => {
  const { data: session } = authClient.useSession();
  const { push } = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <MenuIcon />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[90vw] max-w-[370px] gap-6 p-0">
        <SheetHeader className="px-5 py-2 text-left">
          <SheetTitle className="text-lg font-bold">Menu</SheetTitle>
        </SheetHeader>

        <Separator />

        {session ? (
          <div className="flex items-center gap-3 px-5 pb-2">
            <Avatar className="size-12">
              <AvatarImage src={session.user.image || ""} />
              <AvatarFallback>
                {session.user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col leading-tight">
              <p className="text-base font-semibold">{session.user.name}</p>
              <p className="text-muted-foreground text-xs">
                {session.user.email}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between px-5 pb-3">
            <p className="text-base font-semibold">Olá. Faça seu login!</p>
            <Button onClick={() => push("/login")} size="sm" className="gap-2">
              Login <LogIn className="size-4" />
            </Button>
          </div>
        )}

        {/* ROTAS */}
        <div className="flex w-full flex-col px-2">
          {ROUTES.map((route) =>
            route.name !== "Barbeiros" ? (
              <Button
                key={route.name}
                variant="ghost"
                className="w-full justify-start gap-3 rounded-full px-5 py-3"
                asChild
              >
                <Link href={route.path}>
                  <route.icon className="size-4" />
                  <span className="text-sm font-medium">{route.name}</span>
                </Link>
              </Button>
            ) : (
              <Accordion key={route.name} type="single" collapsible className="-my-2">
                <AccordionItem value="barbers">
                  <AccordionTrigger className="px-3">
                    <div className="flex items-center gap-3">
                      <route.icon className="size-4" />
                      Barbeiros
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="flex flex-col">
                    {barbers.map((barber) => (
                      <Link
                        key={barber.id}
                        href={`/barber/${barber.id}`}
                        className="px-10 py-2 text-sm hover:underline"
                      >
                        {barber.user.name}
                      </Link>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ),
          )}
        </div>

        <Separator className="mt-4" />

        {session && (
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 rounded-full px-5 py-3"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            <span className="text-sm font-medium">Sair da conta</span>
          </Button>
        )}
      </SheetContent>
    </Sheet>
  );
};
