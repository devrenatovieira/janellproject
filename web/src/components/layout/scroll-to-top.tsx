"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Restaura o scroll para o topo a cada mudança de rota.
 * Respeita prefers-reduced-motion (scroll instantâneo).
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [pathname]);

  return null;
}
