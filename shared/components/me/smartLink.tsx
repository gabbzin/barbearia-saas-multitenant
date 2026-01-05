"use client";

import type { LinkProps } from "next/link";
import Link from "next/link";
import { useParams } from "next/navigation";

interface SmartLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
}

export function SmartLink({ href, children, ...props }: SmartLinkProps) {
  const params = useParams();
  const slug = params?.slug as string;

  const finalHref =
    slug && typeof href === "string" && href.startsWith("/")
      ? `${slug}${href}`
      : href;

  return (
    <Link href={finalHref} {...props}>
      {children}
    </Link>
  );
}
