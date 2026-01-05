"use client";

import type { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useParams, useRouter } from "next/navigation";

export function useSmartRouter() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const push = (href: string, options?: NavigateOptions | undefined) => {
    const finalHref = slug && href.startsWith("/") ? `/${slug}${href}` : href;
    return router.push(finalHref, options);
  };

  const replace = (href: string, options?: NavigateOptions | undefined) => {
    const finalHref = slug && href.startsWith("/") ? `/${slug}${href}` : href;
    return router.replace(finalHref, options);
  };

  return {
    ...router,
    push,
    replace,
  };
}
