import Image from "next/image";
import { SidebarMenu } from "./sidebar-menu";
import { prisma } from "@/lib/prisma";

const Header = async () => {
  const barbers = await prisma.barber.findMany({
    include: {
      user: true,
    },
  }); // Ajustar para pegar de user, as características do barbeiro estão em user

  return (
    <header className="flex items-center justify-between bg-white px-5 py-6">
      <Image src="/logo.svg" alt="Aparatus" width={80} height={26.09} />
      <div className="flex items-center gap-2">
        {/* {session ? (
          <div className="flex items-center gap-2">
            <Button
              variant={"outline"}
              size={"icon"}
              onClick={() => authClient.signOut()}
            >
              <LogOutIcon />
            </Button>
          </div>
        ) : (
          <Button
            variant={"outline"}
            size={"icon"}
            onClick={() => push("/login")}
          >
            <LogInIcon />
          </Button>
        )} */}
        {/* <Button variant={"outline"} size={"icon"} asChild>
          <Link href={"/chat"}>
            <MessageCircleIcon />
          </Link>
        </Button> */}
        <SidebarMenu barbers={barbers} />
      </div>
    </header>
  );
};

export default Header;
