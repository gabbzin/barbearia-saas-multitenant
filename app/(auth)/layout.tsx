import { redirect } from "next/navigation";
import { verifySession } from "@/features/user/repository/user.repository";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const session = await verifySession();

  if (session) {
    return redirect("/");
  }

  return <>{children}</>;
}
