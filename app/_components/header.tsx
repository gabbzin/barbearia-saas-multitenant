"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { LogInIcon, LogOutIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { SidebarMenu } from "./sidebar-menu";
import { useRouter } from "next/navigation";

const Header = () => {
  const { data: session } = authClient.useSession();

  const { push } = useRouter();

  return (
    <header className="flex items-center justify-between bg-white px-5 py-6">
      <Image src="/logo.svg" alt="Aparatus" width={80} height={26.09} />
      <div className="flex items-center gap-2">
        {session ? (
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
        )}
        {/* <Button variant={"outline"} size={"icon"} asChild>
          <Link href={"/chat"}>
            <MessageCircleIcon />
          </Link>
        </Button> */}
        <SidebarMenu />
      </div>
    </header>
  );
};

export default Header;
