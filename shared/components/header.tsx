import { getBarbers } from "@/features/barber/services/barbers.repository";
import { getCurrentSubscription } from "@/features/user/repository/user.repository";
import { LogoLink } from "./logo-link";
import { SidebarMenu } from "./sidebar-menu";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";

const Header = async () => {
  const barbers = await getBarbers();
  const isSubscriber = await getCurrentSubscription();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b-2 bg-background px-5 py-6">
      <LogoLink />
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
        <AnimatedThemeToggler />
        <SidebarMenu barbers={barbers} isSubscriber={isSubscriber.hasPlan} />
      </div>
    </header>
  );
};

export default Header;
