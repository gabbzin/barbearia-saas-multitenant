import { getBarbers } from "@/features/barber/services/barbers.repository";
import {
  getCurrentSubscription,
  verifySession,
} from "@/features/user/repository/user.repository";
import { LogoLink } from "./logo-link";
import { SidebarMenu } from "./sidebar-menu";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";

const Header = async () => {
  const barbers = await getBarbers();
  const isSubscriber = await getCurrentSubscription();
  const session = await verifySession();
  let rule = session?.role;

  if (typeof session?.role === "undefined") {
    rule = "USER";
  }

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b-2 bg-background px-5 py-6">
      <LogoLink />
      <div className="flex items-center gap-2">
        <AnimatedThemeToggler />
        <SidebarMenu
          barbers={barbers}
          isSubscriber={isSubscriber.hasPlan}
          role={rule}
        />
      </div>
    </header>
  );
};

export default Header;
