"use client";

import Image from "next/image";
import { redirect } from "next/navigation";

export function LogoLink() {
  const handleLogoClick = () => {
    redirect("/");
  };

  return (
    <Image
      src="/logo.svg"
      alt="Aparatus"
      width={100}
      height={30}
      onClick={handleLogoClick}
      className="cursor-pointer"
    />
  );
}
